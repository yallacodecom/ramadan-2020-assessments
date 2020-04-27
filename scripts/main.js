const url = "http://localhost:7777";
function postAjax(url, data, success) {
  var params =
    typeof data == "string"
      ? data
      : Object.keys(data)
          .map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
          })
          .join("&");

  var xhr = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("POST", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState > 3 && xhr.status == 200) {
      success(xhr.responseText);
    }
  };
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(params);
  return xhr;
}

function submitVideo() {
  var form = document.querySelector("form"),
    formData = new FormData(form);

  var video = {};

  formData.forEach((value, key) => {
    video[key] = value;
  });
  postAjax(`${url}/video-request`, video, function (data) {
    console.log(data);
    document.getElementById("message").innerText =
      "Video Submitted successfully";
  });
  return false;
}
