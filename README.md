# Ramadan 2020 assessments

> Hi all, this is the repo that holds the assessments that covers ramadan 2020 series on [Semicolon academy](https://www.youtube.com/SemicolonAcademy) youtube channel, no implementations here, only the assessments, you could check later the resolutions on different repos on github as well, or watch the series and build it up together.

In this repo you will find some given express server configured to make some CRUD operations for getting and setting a video request from semicolon academy as an example, also you will find an HTML file that has basic design of the required elements styled as well with twitter bootstrap, you only need to clone it and install dependancies of server and configure a local mongodb connection, then you are ready to make your first assessment, goodluck 😉

---

## Assessment 1

> **Junior level** friendly, any other level could benefit from it as well.

1. You should first [Setup MongoDB](https://docs.mongodb.com/manual/installation/) locally and copy the connection url to the required place in `server/models/mongo.config.js` then run `nom start` in the server folder, after that you are not supposed to look back into that file any more.
2. Implement the frontend code to make it works with the basic functionality as follow:
   - Submit request. (API: POST -> `/video-request`)
   - Show list of requests below the form. (API: GET -> `/video-request`)
   - Vote up and down on each request. (API: PUT -> `/video-request/vote`)
	- client-side validation for the fields with * as required and for the email field, topic title should be max 100 char as well.
	- check all payloads in the schema at `server/models/video-requests.model.js` and check the endpoints at `server/index.js`
3. You are **obligated** to write only **Pure JavaScript** code without using any external utility or libraries.
4. You should not write any css code or styling effort as the provided `index.html` file has all what you need.
