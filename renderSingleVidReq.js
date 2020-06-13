import { applyVoteStyle } from './applyVoteStyles.js';
import dataService from './dataService.js';

const listOfVidsElm = document.getElementById('listOfRequests');

export function renderSingleVidReq(vidInfo, state, isPrepend = false) {
  const vidReqContainerElm = document.createElement('div');
  vidReqContainerElm.innerHTML = `
  <div class="card mb-3">
    ${
      state.isSuperUser
        ? `<div class="card-header d-flex justify-content-between">
      <select id="admin_change_status_${vidInfo._id}">
        <option value="new">new</option>
        <option value="planned">planned</option>
        <option value="done">done</option>
      </select>
      <div class="input-group ml-2 mr-5 ${
        vidInfo.status !== 'done' ? 'd-none' : ''
      }" id="admin_video_res_container_${vidInfo._id}">
        <input type="text" class="form-control"
          id="admin_video_res_${vidInfo._id}" 
          placeholder="paste here youtube video id">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" 
            id="admin_save_video_res_${vidInfo._id}"
            type="button">Save</button>
        </div>
      </div>
      <button id="admin_delete_video_req_${
        vidInfo._id
      }" class='btn btn-danger'>delete</button>
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
          ? `<div class="ml-auto mr-3">
        <iframe width="240" height="135"
          src="https://www.youtube.com/embed/${vidInfo.video_ref.link}"
          frameborder="0" allowfullscreen></iframe>
      </div>`
          : ''
      }
      <div class="d-flex flex-column text-center">
        <a id="votes_ups_${vidInfo._id}" class="btn btn-link">🔺</a>
        <h3 id="score_vote_${vidInfo._id}">
          ${vidInfo.votes.ups.length - vidInfo.votes.downs.length}
        </h3>
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
      }">
        <span>${vidInfo.status.toUpperCase()} ${
    vidInfo.status === 'done'
      ? ` on 
        ${new Date(vidInfo.video_ref.date).toLocaleDateString()}`
      : ''
  }</span>
        &bullet; added by <strong>${vidInfo.author_name}</strong> on
        <strong>${new Date(vidInfo.submit_date).toLocaleDateString()}</strong>
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
  if (isPrepend) {
    listOfVidsElm.prepend(vidReqContainerElm);
  } else {
    listOfVidsElm.appendChild(vidReqContainerElm);
  }

  const adminChangeStatusElm = document.getElementById(
    `admin_change_status_${vidInfo._id}`
  );
  const adminVideoResElm = document.getElementById(
    `admin_video_res_${vidInfo._id}`
  );
  const adminVideoResContainer = document.getElementById(
    `admin_video_res_container_${vidInfo._id}`
  );
  const adminSaveVideoResElm = document.getElementById(
    `admin_save_video_res_${vidInfo._id}`
  );
  const adminDeleteVideoReqElm = document.getElementById(
    `admin_delete_video_req_${vidInfo._id}`
  );

  if (state.isSuperUser) {
    adminChangeStatusElm.value = vidInfo.status;
    adminVideoResElm.value = vidInfo.video_ref.link;

    adminChangeStatusElm.addEventListener('change', (e) => {
      if (e.target.value === 'done') {
        adminVideoResContainer.classList.remove('d-none');
      } else {
        dataService.updateVideoStatus(vidInfo._id, e.target.value);
      }
    });

    adminSaveVideoResElm.addEventListener('click', (e) => {
      e.preventDefault();
      if (!adminVideoResElm.value) {
        adminVideoResElm.classList.add('is-invalid');
        adminVideoResElm.addEventListener('input', () =>
          adminVideoResElm.classList.remove('is-invalid')
        );
        return;
      }

      dataService.updateVideoStatus(
        vidInfo._id,
        'done',
        adminVideoResElm.value
      );
    });

    adminDeleteVideoReqElm.addEventListener('click', (e) => {
      e.preventDefault();

      const isSure = confirm(
        `Are you sure you want to delete "${vidInfo.topic_title}"`
      );

      if (!isSure) return;

      dataService.deleteVideoReq(vidInfo._id);
    });
  }
  applyVoteStyle(vidInfo._id, vidInfo.votes, state, vidInfo.status === 'done');

  const votesElms = document.querySelectorAll(
    `[id^=votes_][id$=_${vidInfo._id}]`
  );

  votesElms.forEach((elm) => {
    if (state.isSuperUser || vidInfo.status === 'done') {
      return;
    }
    elm.addEventListener('click', function (e) {
      e.preventDefault();
      const [, vote_type, id] = e.target.getAttribute('id').split('_');

      dataService.updateVotes(
        id,
        vote_type,
        state.userId,
        vidInfo.status === 'done',
        state
      );
    });
  });
}
