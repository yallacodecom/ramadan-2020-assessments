const listOfVidsElm = document.getElementById('listOfRequests');
const SUPER_USER_ID = '19980726';
const state = {
  sortBy: 'newFirst',
  searchTerm: '',
  userId: '',
  isSuperUser: false,
};
// Creating Video card for a single request
function renderSingleVidReq(vidInfo, isPrepend = false) {
  // Template for List of Video Requests
  const vidReqContainerElm = document.createElement('div');
  vidReqContainerElm.className = 'card mb-3';
  vidReqContainerElm.innerHTML = `
      ${
        state.isSuperUser
          ? `<div class="card-header d-flex justify-content-between">
        <select id="admin_change_status_${vidInfo._id}" class="p-1 rounded ">
          <option value="new">New</option>
          <option value="planned">Planned</option>
          <option value="done">Done</option>
        </select>
        <div id="admin_vid_res_container_${
          vidInfo._id
        }" class="input-group ml-2 mr-5 ${
              vidInfo.status !== 'done' ? 'd-none' : ''
            }">
          <input id="admin_input_vid_res_${
            vidInfo._id
          }" type="text" class="form-control" placeholder="Paste here youtube video URL" />
          <div class="input-group-append">
            <button id="admin_save_vid_res_${
              vidInfo._id
            }" class="btn btn-outline-secondary" type="button">Save</button>
          </div>
        </div>
        <div>
          <button id="admin_delete_vid_req_${
            vidInfo._id
          }" class="btn btn-danger">delete</button>
        </div>
      </div>`
          : ''
      }
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
        <div id="votContainer" class="d-flex flex-column text-center"> 
          <a id="votes_ups_${vidInfo._id}" class="btn btn-link">🔺</a>
          <h3 id="score_votes_${vidInfo._id}">${
    vidInfo.votes.ups.length - vidInfo.votes.downs.length
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
  const votesElms = document.querySelectorAll(
    `[id^=votes_][id$=_${vidInfo._id}]`
  );

  votesElms.forEach((elm) => {
    // Disable the vote btn For Super User
    if (state.isSuperUser) {
      elm.classList.add('disabled');
    }
    elm.addEventListener('click', function (e) {
      e.preventDefault();
      // Destractur data I need from btn-id
      const [, vote_type, id] = e.target.getAttribute('id').split('_');
      postVote(id, vote_type, state.userId);
    });
  });
  // Active the current vote btn
  activateBtn(vidInfo.votes, vidInfo._id);

  if (state.isSuperUser) {
    const adminChangeStatusElm = document.getElementById(
      `admin_change_status_${vidInfo._id}`
    );
    const adminVidResContainerElm = document.getElementById(
      `admin_vid_res_container_${vidInfo._id}`
    );
    const adminInputVidElm = document.getElementById(
      `admin_input_vid_res_${vidInfo._id}`
    );
    const adminSaveVidElm = document.getElementById(
      `admin_save_vid_res_${vidInfo._id}`
    );
    const deleteBtnElm = document.getElementById(
      `admin_delete_vid_req_${vidInfo._id}`
    );
    // Change Video Status
    adminChangeStatusElm.addEventListener('change', (e) => {
      e.preventDefault();
      if (e.target.value === 'done') {
        adminVidResContainerElm.classList.remove('d-none');
      } else {
        changeVidStatus(vidInfo._id, e.target.value);
      }
    });

    // Set the init video status
    adminChangeStatusElm.value = vidInfo.status;
    // If done put the video link from the database
    adminInputVidElm.value = vidInfo.video_ref.link;

    // Save Video Res
    adminSaveVidElm.addEventListener('click', (e) => {
      e.preventDefault();
      if (!adminInputVidElm.value) {
        adminInputVidElm.classList.add('is-invalid');
        adminInputVidElm.addEventListener('input', function () {
          this.classList.remove('is-invalid');
        });
        return;
      }
      changeVidStatus(vidInfo._id, 'done', adminInputVidElm.value);
    });

    // Delet Video Req
    deleteBtnElm.addEventListener('click', function (e) {
      e.preventDefault();
      // Cofirom the delete
      const isDelete = confirm(
        `Are you sure you want to delete "${vidInfo.topic_title}"?`
      );
      if (!isDelete) return;
      deleteVidReq(vidInfo._id);
    });
  }
}

function activateBtn(data, id, vote_type) {
  // Return if there is no user id
  if (!state.userId) {
    console.warn('User is not authenticated.');
    return;
  }
  // Check if the user has already voted
  if (!vote_type) {
    if (data.ups.includes(state.userId)) {
      vote_type = 'ups';
    } else if (data.downs.includes(state.userId)) {
      vote_type = 'downs';
    } else {
      return;
    }
  }

  const votesBtnsElms = document.querySelectorAll(`[id^=votes_][id$=_${id}]`);
  votesBtnsElms.forEach((elm) => {
    elm.classList.remove('active_btn');
  });
  if (data[`${vote_type}`].includes(state.userId)) {
    document
      .getElementById(`votes_${vote_type}_${id}`)
      .classList.add('active_btn');
  }
}

// postVote for post vote to the server
function postVote(id, vote_type, user_id) {
  // Get the score of votes
  const scoreVotesElm = document.getElementById(`score_votes_${id}`);
  fetch('http://localhost:7777/video-request/vote', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, vote_type, user_id }),
  })
    .then((blob) => blob.json())
    .then((data) => {
      activateBtn(data, id, vote_type);
      scoreVotesElm.innerText = data.ups.length - data.downs.length;
    })
    .catch((err) => {
      console.log(err);
    });
}
function loadAllVidReqs(sortBy, searchTerm = '') {
  // Fetch all video requests
  fetch(
    `http://localhost:7777/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}`
  )
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
// Implement Debounce function
function debounce(func, delay) {
  let timeout;
  // if the function is called again before the delay time, the previous timeout will be cleared and a new timeout will be set
  return function (...args) {
    // if there is a timeout, clear it and set a new one
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
function checkFormValidity(formData) {
  const topicTitle = formData.get('topic_title');
  const topicDetails = formData.get('topic_details');

  if (!topicTitle) {
    document.querySelector('[name=topic_title]').classList.add('is-invalid');
  }
  if (!topicDetails) {
    document.querySelector('[name=topic_details]').classList.add('is-invalid');
  }

  const allInvalidElms = document
    .getElementById('videoReqForm')
    .querySelectorAll('.is-invalid');
  if (allInvalidElms.length) {
    // Check on every input change
    allInvalidElms.forEach((elm) => {
      elm.addEventListener('input', function () {
        this.classList.remove('is-invalid');
      });
    });
    return false;
  }
  return true;
}
// Change video status
function changeVidStatus(id, status, resVideo = '') {
  fetch('http://localhost:7777/video-request', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, status, resVideo }),
  })
    .then((data) => data.json())
    .then((data) => {
      loadAllVidReqs();
      console.log('Request Status Have been updated', data);
    })
    .catch((err) => {
      console.log(err);
    });
}
// Delete video request
function deleteVidReq(id) {
  fetch('http://localhost:7777/video-request', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then((blob) => blob.json())
    .then((data) => {
      console.log('🚀 ~ file: client.js:202 ~ data:', data);
    })
    .then(() => {
      loadAllVidReqs();
    })
    .catch((err) => {
      console.log(err);
    });
}
// Use DOMContentLoaded event to make sure that the DOM is loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  const videoReqForm = document.getElementById('videoReqForm');
  const sortBySelectElms = document.querySelectorAll(`[id*=sort_by_]`);
  const searchInputElm = document.getElementById('search-box');
  const loginFormElm = document.querySelector('.login-form');
  const appContentElm = document.querySelector('.app-content');

  if (window.location.search) {
    state.userId = new URLSearchParams(window.location.search).get('id');

    if (state.userId === SUPER_USER_ID) {
      state.isSuperUser = true;
      document.getElementById('normal-user-content').classList.add('d-none');
    }
    // add d-none class to the login form then remove it from the video request form
    loginFormElm.classList.add('d-none');
    appContentElm.classList.remove('d-none');
  }

  loadAllVidReqs();
  // send the search value to the server for loading the result
  searchInputElm.addEventListener(
    'input',
    debounce((e) => {
      state.searchTerm = e.target.value;
      loadAllVidReqs(state.sortBy, state.searchTerm);
    }, 300)
  );

  sortBySelectElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      e.preventDefault();

      state.sortBy = this.querySelector('input').value;
      loadAllVidReqs(state.sortBy, state.searchTerm);
      // Active the current Sort btn
      sortBySelectElms.forEach((e) => e.classList.remove('active'));
      this.classList.add('active');
    });
  });

  videoReqForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the data from the form to one variable
    const formData = new FormData(videoReqForm);
    // Send User Id with the request
    formData.append('author_id', state.userId);
    // Check validation of the form
    const isValid = checkFormValidity(formData);

    if (!isValid) return;

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
