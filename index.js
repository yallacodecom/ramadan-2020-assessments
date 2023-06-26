document.addEventListener("DOMContentLoaded", () => {
  const video_req_form = document.getElementById("video_request_form");

  video_req_form.addEventListener("submit", (event) => {
    event.preventDefault();
  
const formdata = new FormData(video_req_form)
    fetch("http://localhost:7777/video-request", {
      method: "POST",
      body: formdata
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  });
});
