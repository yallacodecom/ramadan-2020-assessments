import { activateBtn } from './activateBtn.js';

export function postVote(id, vote_type, user_id, state) {
  // postVote for post vote to the server

  // Get the score of votes
  const scoreVotesElm = document.getElementById(`score_votes_${id}`);
  fetch('http://localhost:7777/video-request/vote', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, vote_type, user_id }),
  })
    .then((blob) => blob.json())
    .then((data) => {
      activateBtn(data, id, vote_type, state.userId);
      scoreVotesElm.innerText = data.ups.length - data.downs.length;
    })
    .catch((err) => {
      console.log(err);
    });
}
