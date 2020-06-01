import { renderSingleVidReq } from './renderSingleVidReq.js';
import { state } from './client.js';

export default {
  updateVideoStatus: (id, status, resVideo = '') => {
    fetch('http://localhost:7777/video-request', {
      method: 'PUT',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ id, status, resVideo }),
    })
      .then((res) => res.json())
      .then((data) => window.location.reload());
  },
  loadAllVidReqs: (
    sortBy = 'newFirst',
    searchTerm = '',
    filterBy = 'all',
    localState = state
  ) => {
    const listOfVidsElm = document.getElementById('listOfRequests');
    fetch(
      `http://localhost:7777/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy}`
    )
      .then((blob) => blob.json())
      .then((data) => {
        listOfVidsElm.innerHTML = '';
        data.forEach((vidInfo) => {
          renderSingleVidReq(vidInfo, localState);
        });
      });
  },
};
