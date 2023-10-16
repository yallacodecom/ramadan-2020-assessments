import { debounce } from './debounce.js';
import { renderSingleVidReq } from './renderSingleVidReq.js';
import { checkFormValidity } from './checkFormValidity.js';
import API from './api.js';

const SUPER_USER_ID = '19980726';
export const state = {
  sortBy: 'newFirst',
  searchTerm: '',
  filterBy: 'all',
  userId: '',
  isSuperUser: false,
};

// Use DOMContentLoaded event to make sure that the DOM is loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  const videoReqForm = document.getElementById('videoReqForm');
  const sortBySelectElms = document.querySelectorAll(`[id*=sort_by_]`);
  const searchInputElm = document.getElementById('search-box');
  const loginFormElm = document.querySelector('.login-form');
  const appContentElm = document.querySelector('.app-content');
  const filterByInputsElms = document.querySelectorAll(`[id*=filter_by_]`);

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

  API.loadAllVidReqs(state);
  // send the search value to the server for loading the result
  searchInputElm.addEventListener(
    'input',
    debounce((e) => {
      state.searchTerm = e.target.value;
      API.loadAllVidReqs(state.sortBy, state.searchTerm, state.filterBy);
    }, 300)
  );

  sortBySelectElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      e.preventDefault();

      state.sortBy = this.querySelector('input').value;
      API.loadAllVidReqs(state.sortBy, state.searchTerm, state.filterBy);
      // Active the current Sort btn
      sortBySelectElms.forEach((e) => e.classList.remove('active'));
      this.classList.add('active');
    });
  });

  filterByInputsElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      e.preventDefault();
      state.filterBy = this.querySelector('input').value;
      API.loadAllVidReqs(state.sortBy, state.searchTerm, state.filterBy);
      // Active the current Sort btn
      filterByInputsElms.forEach((e) => e.classList.remove('active'));
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
        renderSingleVidReq(data, state, true);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
