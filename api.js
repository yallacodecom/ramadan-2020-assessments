import { renderSingleVidReq } from './renderSingleVidReq.js';
import { state } from './client.js';

export default {
  loadAllVidReqs: (
    sortBy = 'newFirst',
    searchTerm = '',
    filterBy = 'all',
    localState = state
  ) => {
    const listOfVidsElm = document.getElementById('listOfRequests');

    // Fetch all video requests
    fetch(
      `http://localhost:7777/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy} `
    )
      .then((blob) => blob.json())
      .then((data) => {
        listOfVidsElm.innerHTML = '';
        data.forEach((vid) => {
          renderSingleVidReq(vid, localState);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  changeVidStatus: function (id, status, resVideo = '', localState = state) {
    fetch('http://localhost:7777/video-request', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status, resVideo }),
    })
      .then((data) => data.json())
      .then((data) => {
        this.loadAllVidReqs(localState.filterBy);
        console.log('Request Status Have been updated', data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteVidReq: function (id, localState = state) {
    fetch('http://localhost:7777/video-request', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((blob) => blob.json())
      .then(() => {
        this.loadAllVidReqs(localState.filterBy);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
