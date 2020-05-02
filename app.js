(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", (event) => {
    // app global scope
    const app = (window.app = window.app || {});

    // configs
    let apiHost = "http://localhost:7777";
    let api = {
      postVideoRequest: `${apiHost}/video-request`,
      getVideoRequests: `${apiHost}/video-request`,
      deleteVideoRequest: `${apiHost}/video-request`,
      voteOnRequest: `${apiHost}/video-request/vote`,
    };

    // app state
    let state = {
      videoRequest: [],
    };

    // on app ready, get video requests
    getVideoRequests();

    const requestsListContainerElement = document.querySelector(
      "#listOfRequests"
    );

    const requestEmptyState = () => {
      const template = document.querySelector('template.video-request--empty-state');
      return template.innerHTML;
    };

    const buildVideoRequestHtml = ({
      _id,
      author_name,
      author_email,
      status,
      submit_date,
      topic_title,
      expected_result,
      target_level,
      update_date,
      video_ref,
      votes,
    }) => `
      <div class="card mb-3 video-request" data-id="${_id}">
        <div class="card-body d-flex justify-content-between flex-row">
          <div class="d-flex flex-column">
            <h3 class="video-request__topic">${topic_title}</h3>
            <p class="text-muted mb-2" class="video-request__topic-details">${
              topic_title || "N/A"
            }</p>
            <strong>Expected results:</strong>
            <p class="mb-0 text-muted" class="video-request__expected-result">${
              expected_result || "N/A"
            }</p>
          </div>
          <div class="d-flex flex-column text-center">
            <button type="button" class="btn btn-link" onClick="app.onRequestVote('ups', '${_id}')">🔺</button>
            <h3 class="video-request__votes">${
              votes.ups - votes.downs || 0
            }</h3>
            <button type="button" class="btn btn-link" onClick="app.onRequestVote('downs', '${_id}')">🔻</button>
          </div>
        </div>
        <div class="card-footer d-flex flex-row justify-content-between">
          <div>
            <span class="text-info" class="video-request__status">${status.toUpperCase()}</span>
            &bullet; added by <strong class="video-request__by" title="${author_email}">${author_name}</strong> on
            <strong class="video-request__at">${app.datePipe(
              submit_date
            )}</strong>
          </div>

          <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
            <div class="badge badge-success" class="video-request__level">${target_level}</div>
          </div>

          <button type="button" class="btn btn-danger" onClick="app.onRequestDelete(event, '${_id}')">
            <svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
          </svg>
          </button>
        </div>
      </div>
    `;

    // compose HTML for video requests
    function composeVideoRequestsListHtml(data = []) {
      return data.length
        ? data.map((item) => buildVideoRequestHtml(item)).join("")
        : requestEmptyState();
    }

    // render requests
    function renderList() {
      requestsListContainerElement.innerHTML = composeVideoRequestsListHtml(
        state.videoRequest
      );
    }

    // render updated voting
    function renderRequest(requestData) {
      const targetElement = document.querySelector(
        `.video-request[data-id='${requestData._id}']`
      );
      targetElement.outerHTML = buildVideoRequestHtml(requestData);
    }

    // submit single video request
    function submitVideoRequest(payload, onSuccess, onError) {
      fetch(api.postVideoRequest, {
        method: "POST",
        body: payload,
      })
        .then((response) => response.json())
        .then(onSuccess)
        .catch(onError);
    }

    // get video requests
    function getVideoRequests() {
      fetch(api.getVideoRequests)
        .then((response) => response.json())
        .then((data) => {
          // console.log("GET Success:", data);
          state.videoRequest = data;
          renderList();
        })
        .catch((error) => {
          console.error("GET Error:", error);
        });
    }

    // delete request by ID
    function deleteVideoRequest(id, onSuccess, onError) {
      fetch(api.deleteVideoRequest, {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then(onSuccess)
        .catch(onError);
    }

    // Vote on a video request
    function voteOnRequest(
      { requestID: id, VoteType: vote_type },
      onSuccess,
      onError
    ) {
      fetch(api.voteOnRequest, {
        method: "PUT",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ id, vote_type }),
      })
        .then((response) => response.json())
        .then(onSuccess)
        .catch(onError);
    }

    app.onRequestSubmit = (event) => {
      event.preventDefault();
      const form = event.target;

      submitVideoRequest(
        new FormData(form),
        () => {
          getVideoRequests();
          form.reset();
        },
        console.log
      );
    };

    app.onRequestDelete = (event, requestID) => {
      if (!requestID) return;
      event.preventDefault();
      deleteVideoRequest(requestID, getVideoRequests, console.log);
    };

    app.onRequestVote = (VoteType = "ups" || "downs", requestID) => {
      if (!requestID) return;
      voteOnRequest({ requestID, VoteType }, renderRequest, console.log);
    };

    app.datePipe = (date) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString("en-US", options);
    };

  });
})();
