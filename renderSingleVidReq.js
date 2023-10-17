import { activateBtn } from './activateBtn.js';
import dataService from './dataService.js';

const listOfVidsElm = document.getElementById('listOfRequests');

function formatDate(date) {
  return new Date(date).toDateString();
}

function bindAdminActions(id, status, videoRef, title, state) {
  if (state.isSuperUser) {
    const adminChangeStatusElm = document.getElementById(
      `admin_change_status_${id}`
    );
    const adminVidResContainerElm = document.getElementById(
      `admin_vid_res_container_${id}`
    );
    const adminInputVidElm = document.getElementById(
      `admin_input_vid_res_${id}`
    );
    const adminSaveVidElm = document.getElementById(`admin_save_vid_res_${id}`);
    const deleteBtnElm = document.getElementById(`admin_delete_vid_req_${id}`);
    // Change Video Status
    adminChangeStatusElm.addEventListener('change', (e) => {
      e.preventDefault();
      if (e.target.value === 'done') {
        adminVidResContainerElm.classList.remove('d-none');
      } else {
        dataService.changeVidStatus(id, e.target.value);
      }
    });

    // Set the init video status
    adminChangeStatusElm.value = status;
    // If done put the video link from the database
    adminInputVidElm.value = videoRef.link;

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
      dataService.changeVidStatus(id, 'done', adminInputVidElm.value);
    });

    // Delet Video Req
    deleteBtnElm.addEventListener('click', function (e) {
      e.preventDefault();
      // Cofirom the delete
      const isDelete = confirm(`Are you sure you want to delete "${title}"?`);
      if (!isDelete) return;
      dataService.deleteVidReq(id);
    });
  }
}

function bindVotesActions(id, state, status, votes) {
  // Get Votes up and down buttons
  const votesElms = document.querySelectorAll(`[id^=votes_][id$=_${id}]`);

  votesElms.forEach((elm) => {
    // Disable the vote btn For Super User OR if the status is done
    if (state.isSuperUser || status === 'done') {
      elm.classList.add('disabled');
    }
    elm.addEventListener('click', function (e) {
      e.preventDefault();
      // Destractur data I need from btn-id
      const [, vote_type, id] = e.target.getAttribute('id').split('_');
      // Prevent voting and If the status is done
      if (state.isSuperUser || status === 'done') {
        return;
      }
      dataService.updateVotes(id, vote_type, state.userId, state);
    });
  });

  //  Active the current vote btn
  activateBtn(votes, id, null, state.userId);
}

export function renderSingleVidReq(vidInfo, state, isPrepend = false) {
  const {
    _id: id,
    status,
    topic_title: title,
    topic_details: details,
    expected_result: expercted,
    votes,
    video_ref: videoRef,
    author_name: author,
    target_level: level,
    submit_date: submitDate,
  } = vidInfo;

  const statusClass =
    status === 'done'
      ? 'text-success'
      : status === 'planned'
      ? 'text-primary'
      : '';

  const voteScore = votes.ups.length - votes.downs.length;

  // Template for List of Video Requests
  const vidReqContainerElm = document.createElement('div');
  vidReqContainerElm.className = 'card mb-3';
  vidReqContainerElm.innerHTML = `
      ${
        state.isSuperUser
          ? `<div class="card-header d-flex justify-content-between">
        <select id="admin_change_status_${id}" class="p-1 rounded ">
          <option value="new">New</option>
          <option value="planned">Planned</option>
          <option value="done">Done</option>
        </select>
        <div id="admin_vid_res_container_${id}" class="input-group ml-2 mr-5 ${
              status !== 'done' ? 'd-none' : ''
            }">
          <input id="admin_input_vid_res_${id}" type="text" class="form-control" placeholder="Paste here youtube video URL" />
          <div class="input-group-append">
            <button id="admin_save_vid_res_${id}" class="btn btn-outline-secondary" type="button">Save</button>
          </div>
        </div>
        <div>
          <button id="admin_delete_vid_req_${id}" class="btn btn-danger">delete</button>
        </div>
      </div>`
          : ''
      }
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${title}</h3>
          <p class="text-muted mb-2">${details}</p>
          <p class="mb-0 text-muted">
            ${expercted && `<strong>Expected results:</strong> ${expercted}`}
          </p>
                </div>
        ${
          status === 'done'
            ? `
              <div class='ml-auto mr-3'>
              <iframe width="240" height="135" src="https://www.youtube.com/embed/${videoRef.link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              `
            : ''
        }
        <div id="votContainer" class="d-flex flex-column text-center"> 
          <a id="votes_ups_${id}" class="btn btn-link">🔺</a>
          <h3 id="score_votes_${id}">${voteScore}</h3>
          <a id="votes_downs_${id}" class="btn btn-link">🔻</a>
        </div>
          
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div class="${statusClass} " >
          <span">${status.toUpperCase()} ${
    status === 'done' ? `on <strong>${formatDate(videoRef.date)}` : ''
  }</strong></span>
          &bullet; added by <strong>${author}</strong> on
          <strong>${formatDate(submitDate)}</strong>
        </div>
        <div
          class="d-flex justify-content-center flex-column 408ml-auto mr-2"
        >
        <div>
        ${
          level == 'begineer'
            ? `<div class="badge badge-success mr-2">Begginer</div>`
            : level == 'medium'
            ? `<div class="badge badge-warning mr-2">Medium</div>`
            : `<div class="badge badge-primary mr-2">Advanced</div>`
        }
        </div>
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

  bindAdminActions(id, status, videoRef, title, state);

  bindVotesActions(id, state, status, votes);
}
