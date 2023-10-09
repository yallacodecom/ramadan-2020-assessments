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
    <a class="btn btn-link">🔺</a>
    <h3>0</h3>
    <a class="btn btn-link">🔻</a>
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
  // getReqBtn.addEventListener('click', () => {
  fetch('http://localhost:7777/video-request')
    .then((blob) => blob.json())
    .then((data) => {
      data.forEach((vidInfo) => {
        listOfVidsElm.appendChild(getSingleVidReq(vidInfo));
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
        // use prepend to add the new request to the top of the list
        listOfVidsElm.prepend(getSingleVidReq(data));
      })
      .catch((err) => {
        console.log(err);
      });
  });
  // Show list of requests below the form. (API: GET -> `/video-request`)
  // 1. Create a function to get the list of requests from the server
});
