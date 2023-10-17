import api from './api.js';
import { renderSingleVidReq } from './renderSingleVidReq.js';
import { activateBtn } from './activateBtn.js';
import { state } from './client.js';

export default {
  addNewVidReq: (formData) => {
    return api.videoReq.post(formData);
  },
  loadAllVidReqs: (
    sortBy = 'newFirst',
    searchTerm = '',
    filterBy = 'all',
    localState = state
  ) => {
    const listOfVidsElm = document.getElementById('listOfRequests');

    api.videoReq
      .get(sortBy, searchTerm, filterBy)
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
    return api.videoReq
      .update(id, status, resVideo)
      .then((data) => {
        this.loadAllVidReqs(localState.filterBy);
        console.log('Request Status Have been updated', data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteVidReq: function (id, localState = state) {
    return api.videoReq
      .delete(id)
      .then((data) => {
        this.loadAllVidReqs(localState.filterBy);
        console.log('Request Have been deleted', data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  updateVotes: function (id, vote_type, user_id, localState = state) {
    // Get the score of votes
    const scoreVotesElm = document.getElementById(`score_votes_${id}`);

    return api.votes.update(id, vote_type, user_id).then((data) => {
      scoreVotesElm.innerText = data.ups.length - data.downs.length;
      activateBtn(data, id, vote_type, localState.userId);
    });
  },
};
