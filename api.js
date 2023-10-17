const apiUrl = 'http://localhost:7777/video-request';
export default {
  videoReq: {
    get: (sortBy, searchTerm, filterBy) => {
      return fetch(
        `${apiUrl}?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy} `
      ).then((blob) => blob.json());
    },
    post: (formData) => {
      return fetch(apiUrl, {
        method: 'POST',
        body: formData,
      }).then((blob) => blob.json());
    },
    update: (id, status, resVideo = '') => {
      return fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, resVideo }),
      }).then((data) => data.json());
    },
    delete: (id) => {
      return fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      }).then((blob) => blob.json());
    },
  },
  votes: {
    update: (id, vote_type, user_id) => {
      return fetch(`${apiUrl}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, vote_type, user_id }),
      }).then((blob) => blob.json());
    },
  },
};
