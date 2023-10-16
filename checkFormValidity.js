export function checkFormValidity(formData) {
  const topicTitle = formData.get('topic_title');
  const topicDetails = formData.get('topic_details');

  if (!topicTitle) {
    document.querySelector('[name=topic_title]').classList.add('is-invalid');
  }
  if (!topicDetails) {
    document.querySelector('[name=topic_details]').classList.add('is-invalid');
  }

  const allInvalidElms = document
    .getElementById('videoReqForm')
    .querySelectorAll('.is-invalid');
  if (allInvalidElms.length) {
    // Check on every input change
    allInvalidElms.forEach((elm) => {
      elm.addEventListener('input', function () {
        this.classList.remove('is-invalid');
      });
    });
    return false;
  }
  return true;
}
