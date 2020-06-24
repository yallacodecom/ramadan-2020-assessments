# Ramadan 2020 assessments

> Hi all, this is the repo that holds the assessments that covers ramadan 2020 series on [Semicolon academy](https://www.youtube.com/SemicolonAcademy) youtube channel, no implementations here, only the assessments, you could check later the resolutions on different repos on github as well, or watch the series and build it up together.

In this repo you will find some given express server configured to make some basic CRUD operations for getting and setting a video request from semicolon academy (as an example), also you will find an HTML file that has basic design of the required elements styled as well with twitter bootstrap, you only need to clone it and install dependencies of server and configure a local mongodb connection, then you are ready to make your first assessment, good luck 😉

---

## Assessment 1 (Junior level friendly)

1. After cloning the repo and installing the dependencies in the server folder, you should next [setup mongodb](https://docs.mongodb.com/manual/installation/) locally and copy the connection url to the required place in `server/models/mongo.config.js`.
2. Navigate to server directory, run `npm install` then run `npm start` in the server folder (btw, cors are enabled so you can run server if you want on a separate port).
3. Implement the frontend code to make it work with the following functionalities:
   - [ ] Submit a video request. (API: POST -> `/video-request`)
   - [ ] Show list of requests below the form. (API: GET -> `/video-request`)
   - [ ] Vote up and down on each request. (API: PUT -> `/video-request/vote`)
   - [ ] Sorting options `new first` the default one, and `top voted first`.
   - [ ] Search box to search for video requests.
   - [ ] Client-side validation for the fields with * as required and for the email field, topic title should be max 100 length.
   - [ ] Add signup/login form with email.
   - [ ] Make votes unique so no one could cheat, using unique user, enhance the voting experience.
   - [ ] Make a super user capabilities, delete, add resolution video, and change status. all are only visible to him.
   - [ ] Add style to the super user capabilities and make filter by request statuses (`NEW`, `PLANNED`, `DONE`).
4. Feel free to enhance the APIs to suit your needs if needed.
5. You are supposed after all to make the requests work using AJAX to make the project looks like a SPA.
6. Check all payloads in the schema at `server/models/video-requests.model.js` and check the endpoints at `server/index.js`
7. You are **obligated** to write only **pure JavaScript** code without using any external utility or libraries.
8. You should not write any css code or styling effort as the provided `index.html` file has almost all what you need, but you can use the bootstrap provided classes.

*You can find the final version of the solution on the [final branch](https://github.com/semicolon-academy/ramadan-2020-assessments/tree/final)*
