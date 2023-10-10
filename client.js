const listOfVidsElm = document.getElementById('listOfRequests');

// Creating Video card for a single request
function renderSingleVidReq(vidInfo, isPrepend = false) {
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

  // Prepend the new request to the top of the list
  if (isPrepend) {
    listOfVidsElm.prepend(vidReqContainerElm);
  } else {
    listOfVidsElm.appendChild(vidReqContainerElm);
  }
  // Get Votes up and down buttons
  const votesUpBtnElm = document.getElementById(`votes_ups_${vidInfo._id}`);
  const votesDownBtnElm = document.getElementById(`votes_downs_${vidInfo._id}`);
  // Add event listener to the votes up and down buttons
  votesUpBtnElm.addEventListener('click', () => {
    postVote(vidInfo._id, 'ups');
  });
  votesDownBtnElm.addEventListener('click', () => {
    postVote(vidInfo._id, 'downs');
  });
}

function loadAllVidReqs(sortBy = 'newFirst') {
  // Fetch all video requests
  fetch(`http://localhost:7777/video-request?sortBy=${sortBy}`)
    .then((blob) => blob.json())
    .then((data) => {
      listOfVidsElm.innerHTML = '';
      data.forEach((vid) => {
        renderSingleVidReq(vid);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// postVote for post vote to the server
function postVote(id, vote_type) {
  // Get the score of votes
  const scoreVotesElm = document.getElementById(`score_votes_${id}`);
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
// Use DOMContentLoaded event to make sure that the DOM is loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  const videoReqForm = document.getElementById('videoReqForm');
  const sortBySelectElms = document.querySelectorAll(`[id*=sort_by_]`);
  loadAllVidReqs();

  sortBySelectElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      e.preventDefault();

      const sortBy = this.querySelector('input');
      loadAllVidReqs(sortBy.value);
      // Active the current Sort btn
      sortBySelectElms.forEach((e) => e.classList.remove('active'));
      this.classList.add('active');
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
        renderSingleVidReq(data, true);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
