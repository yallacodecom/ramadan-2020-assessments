export function activateBtn(data, id, vote_type, userId) {
  // Return if there is no user id
  if (!userId) {
    console.warn('User is not authenticated.');
    return;
  }

  // Check if the user has already voted
  if (!vote_type) {
    if (data.ups.includes(userId)) {
      vote_type = 'ups';
    } else if (data.downs.includes(userId)) {
      vote_type = 'downs';
    } else {
      return;
    }
  }

  const votesBtnsElms = document.querySelectorAll(`[id^=votes_][id$=_${id}]`);
  votesBtnsElms.forEach((elm) => {
    elm.classList.remove('active_btn');
  });
  if (data[`${vote_type}`].includes(userId)) {
    document
      .getElementById(`votes_${vote_type}_${id}`)
      .classList.add('active_btn');
  }
}
