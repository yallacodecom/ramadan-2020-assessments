// Creating Video card for a single request
function getSingleVidReq(vidInfo) {
  // Template for List of Video Requests
  const vidReqContainerElm = document.createElement('div');
  vidReqContainerElm.className = 'card mb-3';
  vidReqContainerElm.innerHTML = `
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${vidInfo.topic_title}</h3>
          <p class="text-muted mb-2">${vidInfo.topic_details}</p>
          <p class="mb-0 text-muted">
            ${
              vidInfo.expected_result &&
              `<strong>Expected results:</strong> ${vidInfo.expected_result}`
            }
          </p>
        </div>
        <div class="d-flex flex-column text-center">
          <a id="votes_ups_${vidInfo._id}" class="btn btn-link">🔺</a>
          <h3 id="score_votes_${vidInfo._id}">${
    vidInfo.votes.ups - vidInfo.votes.downs
  }</h3>
          <a id="votes_downs_${vidInfo._id}" class="btn btn-link">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div>
          <span class="text-info">${vidInfo.status.toUpperCase()}</span>
          &bullet; added by <strong>${vidInfo.author_name}</strong> on
          <strong>${new Date(vidInfo.submit_date).toDateString()}</strong>
        </div>
        <div
          class="d-flex justify-content-center flex-column 408ml-auto mr-2"
        >
          <div class="badge badge-success">
          ${vidInfo.target_level}
          </div>
        </div>
      </div>
      </div>
      `;
  return vidReqContainerElm;
}
// Use DOMContentLoaded event to make sure that the DOM is loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  const videoReqForm = document.getElementById('videoReqForm');
  const listOfVidsElm = document.getElementById('listOfRequests');

  // Get the list of requests from the server
  fetch('http://localhost:7777/video-request')
    .then((blob) => blob.json())
    .then((data) => {
      data.forEach((vidInfo) => {
        listOfVidsElm.appendChild(getSingleVidReq(vidInfo));
        // Get Votes up and down buttons
        const votesUpBtnElm = document.getElementById(
          `votes_ups_${vidInfo._id}`
        );
        const votesDownBtnElm = document.getElementById(
          `votes_downs_${vidInfo._id}`
        );
        // Get the score of votes
        const scoreVotesElm = document.getElementById(
          `score_votes_${vidInfo._id}`
        );
        // Add event listener to the votes up and down buttons
        votesUpBtnElm.addEventListener('click', () => {
          const id = vidInfo._id;
          postVote(id, 'ups');
        });
        votesDownBtnElm.addEventListener('click', () => {
          const id = vidInfo._id;
          postVote(id, 'downs');
        });
        // postVote for post vote to the server
        function postVote(id, vote_type) {
          fetch('http://localhost:7777/video-request/vote', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, vote_type }),
          })
            .then((blob) => blob.json())
            .then((data) => {
              scoreVotesElm.innerText = data.ups - data.downs;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    });

  videoReqForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the data from the form to one variable
    const formData = new FormData(videoReqForm);

    // Send the data using post method using fetch api
    fetch('http://localhost:7777/video-request', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // add the new request to the top of the list using Prepend
        listOfVidsElm.prepend(getSingleVidReq(data));
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
