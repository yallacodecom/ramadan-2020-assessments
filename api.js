const apiUrl = 'http://localhost:7777';

export default {
  videoReq: {
    get: (sortBy, searchTerm, filterBy) => {
      return fetch(
        `${apiUrl}/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy}`
      ).then((blob) => blob.json());
    },
    post: (formData) => {
      return fetch(`${apiUrl}/video-request`, {
        method: 'POST',
        body: formData,
      }).then((bolb) => bolb.json());
    },
    update: (id, status, resVideo) => {
      return fetch(`${apiUrl}/video-request`, {
        method: 'PUT',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ id, status, resVideo }),
      }).then((res) => res.json());
    },
    delete: (id) => {
      return fetch(`${apiUrl}/video-request`, {
        method: 'DELETE',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).then((res) => res.json());
    },
  },
  votes: {
    update: (id, vote_type, user_id) => {
      return fetch(`${apiUrl}/video-request/vote`, {
        method: 'PUT',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ id, vote_type, user_id }),
      }).then((bolb) => bolb.json());
    },
  },
};
