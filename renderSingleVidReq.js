import { activateBtn } from './activateBtn.js';
import dataService from './dataService.js';

const listOfVidsElm = document.getElementById('listOfRequests');

export function renderSingleVidReq(vidInfo, state, isPrepend = false) {
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
        ${
          vidInfo.status === 'done'
            ? `
              <div class=ml-auto mr-3>
              <iframe width="240" height="135" src="https://www.youtube.com/embed/${vidInfo.video_ref.link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              `
            : ''
        }
        <div id="votContainer" class="d-flex flex-column text-center"> 
          <a id="votes_ups_${vidInfo._id}" class="btn btn-link">🔺</a>
          <h3 id="score_votes_${vidInfo._id}">${
    vidInfo.votes.ups.length - vidInfo.votes.downs.length
  }</h3>
          <a id="votes_downs_${vidInfo._id}" class="btn btn-link">🔻</a>
        </div>
          
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div class="${
          vidInfo.status === 'done'
            ? 'text-success'
            : vidInfo.status === 'planned'
            ? 'text-primary'
            : ''
        } " >
          <span">${vidInfo.status.toUpperCase()} ${
    vidInfo.status === 'done'
      ? `on <strong>${new Date(vidInfo.video_ref.date).toDateString()}`
      : ''
  }</strong></span>
          &bullet; added by <strong>${vidInfo.author_name}</strong> on
          <strong>${new Date(vidInfo.submit_date).toDateString()}</strong>
        </div>
        <div
          class="d-flex justify-content-center flex-column 408ml-auto mr-2"
        >
        <div>
        ${
          vidInfo.target_level == 'begineer'
            ? `<div class="badge badge-success mr-2">Begginer</div>`
            : vidInfo.target_level == 'medium'
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
  // Get Votes up and down buttons
  const votesElms = document.querySelectorAll(
    `[id^=votes_][id$=_${vidInfo._id}]`
  );

  votesElms.forEach((elm) => {
    // Disable the vote btn For Super User OR if the status is done
    if (state.isSuperUser || vidInfo.status === 'done') {
      elm.classList.add('disabled');
    }
    elm.addEventListener('click', function (e) {
      e.preventDefault();
      // Destractur data I need from btn-id
      const [, vote_type, id] = e.target.getAttribute('id').split('_');
      // Prevent voting and If the status is done
      if (state.isSuperUser || vidInfo.status === 'done') {
        return;
      }
      dataService.updateVotes(id, vote_type, state.userId, state);
    });
  });

  //  Active the current vote btn
  activateBtn(vidInfo.votes, vidInfo._id, null, state.userId);

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
        dataService.changeVidStatus(vidInfo._id, e.target.value);
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
      dataService.changeVidStatus(vidInfo._id, 'done', adminInputVidElm.value);
    });

    // Delet Video Req
    deleteBtnElm.addEventListener('click', function (e) {
      e.preventDefault();
      // Cofirom the delete
      const isDelete = confirm(
        `Are you sure you want to delete "${vidInfo.topic_title}"?`
      );
      if (!isDelete) return;
      dataService.deleteVidReq(vidInfo._id);
    });
  }
}
