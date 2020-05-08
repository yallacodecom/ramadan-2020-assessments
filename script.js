const videoForm = document.querySelector("[data-video-form-request]");
const videoRequestsContainer = document.getElementById("listOfRequests");
const sortByVotesBtn = document.querySelector("[data-list-sort-by-votes]");
const sortByNewBtn = document.querySelector("[data-list-sort-by-new]");
const searchForVideo = document.querySelector("[data-search-for-video]");
let sortBy = "newFirst";
let searchTerm = "";
//  search section

searchForVideo.addEventListener(
  "input",
  debounce(() => {
    searchTerm = searchForVideo.value;
    render(sortBy, searchTerm);
  })
);

// sort btn section
sortByVotesBtn.addEventListener("click", () => {
  sortBy = "topVotedFirst";
  render(sortBy, searchTerm);
});

sortByNewBtn.addEventListener("click", () => {
  sortBy = "newFirst";
  render(sortBy, searchTerm);
});

// post video request to /video-request
videoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const videoBody = new FormData(videoForm);
  fetch("http://localhost:7777/video-request", {
    method: "POST",
    body: videoBody,
  })
    .then((response) => response.json())
    .then(() => {
      resetForm();
      render();
    });
});

// get videos from /video-request

function render(sortBy = "newFirst", searchTerm = "") {
  clearElement(videoRequestsContainer);

  let videos;
  fetch(
    `http://localhost:7777/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}`
  )
    .then((response) => response.json())
    .then((data) => (videos = data))
    .then(() => renderVideoList(videos));
}

function renderVideoList(videos) {
  // console.log(videos);
  videos.forEach((video) => {
    let videoType = video[1] || video[1] == 0 ? video[0] : video;
    let {
      _id,
      author_name,
      target_level,
      expected_result,
      status,
      topic_details,
      topic_title,
      update_date,
      votes,
    } = videoType;

    let videoTemplate = `
    <div class="card mb-3">
    <div class="card-body d-flex justify-content-between flex-row">
      <div class="d-flex flex-column">
        <h3> ${topic_title} </h3>
        <p class="text-muted mb-2">${topic_details}</p>
        <p class="mb-0 text-muted">
          ${
            expected_result &&
            `<strong>Expected results:</strong> ${expected_result}`
          }
        </p>
      </div>
      <div class="d-flex flex-column text-center">
        <a class="btn btn-link" data-up-vote-${_id} >🔺</a>
        <h3 data-votes-${_id} >0</h3>
        <a class="btn btn-link" data-down-vote-${_id} >🔻</a>
      </div>
    </div>
    <div class="card-footer d-flex flex-row justify-content-between">
      <div>
        <span class="text-info">${status}</span>
        &bullet; added by <strong> ${author_name} </strong> on
        <strong> ${new Date(update_date).toLocaleDateString()} </strong>
      </div>
      <div
        class="d-flex justify-content-center flex-column 408ml-auto mr-2"
      >
        <div class="badge badge-success">
          ${target_level}
        </div>
      </div>
    </div>
  </div>
    
    `;
    let videoElmnt = document.createElement("div");
    videoElmnt.innerHTML = videoTemplate;
    videoRequestsContainer.appendChild(videoElmnt);

    const upVoteBtn = document.querySelector(`[data-up-vote-${_id}]`);
    const downVoteBtn = document.querySelector(`[data-down-vote-${_id}]`);
    const votesTitle = document.querySelector(`[data-votes-${_id}]`);

    // votes text
    votesTitle.textContent = votes.ups - votes.downs;

    // vote up section
    upVoteBtn.addEventListener("click", () => vote("ups", _id, votesTitle));

    // vote down section
    downVoteBtn.addEventListener("click", () => vote("downs", _id, votesTitle));
  });
}

function sortByVotes(videos) {
  let listArr = [];
  for (let listElm of videos) {
    let listVotes = listElm.votes.ups - listElm.votes.downs;
    listArr.push([listElm, listVotes]);
  }

  let sortedArr = listArr.sort((a, b) => a[1] < b[1]);
  renderVideoList(sortedArr);
}

function vote(type, _id, votesTitle) {
  fetch("http://localhost:7777/video-request/vote", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: _id, vote_type: type }),
  })
    .then((response) => response.json())
    .then((data) => (votesTitle.textContent = data.ups - data.downs));
}

function resetForm() {
  const videoBody = new FormData(videoForm);
  for (let key of videoBody.entries()) {
    document.getElementsByName(key[0])[0].value = "";
  }
}

function clearElement(element) {
  // while (element.firstChild) {
  //   element.removeChild(element.firstChild);
  // }
  element.innerHTML = "";
}

function debounce(fn) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), 500);
  };
}

render();
