# Ramadan 2020 assessments

> Hi all, this is the repo that holds the assessments that covers ramadan 2020 series on [Semicolon academy](https://www.youtube.com/SemicolonAcademy) youtube channel, no implementations here, only the assessments, you could check later the resolutions on different repos on github as well, or watch the series and build it up together.

In this repo you will find some given express server configured to make some CRUD operations for getting and setting a video request from semicolon academy as an example, also you will find an HTML file that has basic design of the required elements styled as well with twitter bootstrap, you only need to clone it and install dependancies of server and configure a local mongodb connection, then you are ready to make your first assessment, goodluck 😉

---

## Assessment 1 (Junior level friendly)

1. After cloning the repo and installing the dependancies in the server folder, you should next [setup mongodb](https://docs.mongodb.com/manual/installation/) locally and copy the connection url to the required place in `server/models/mongo.config.js` then run `npm start` in the server folder, after that you are not supposed to do anything else into that folder anymore unless you would like to enhance it for a better experience.
2. Implement the frontend code to make it work with the basic functionality as follow:
   - Submit a video request. (API: POST -> `/video-request`)
   - Show list of requests below the form. (API: GET -> `/video-request`)
   - Vote up and down on each request. (API: PUT -> `/video-request/vote`)
	- Client-side validation for the fields with * as required and for the email field, topic title should be max 100 char as well.
   - You are supposed after all to make the requests work using AJAX.
3. Check all payloads in the schema at `server/models/video-requests.model.js` and check the endpoints at `server/index.js`
4. You are **obligated** to write only **pure JavaScript** code without using any external utility or libraries.
5. You should not write any css code or styling effort as the provided `index.html` file has all what you need.
