const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongodbUrl = 'mongodb://127.0.0.1:27017'; // TODO: PUT YOUR VALID MONGODB CONNECTION URL HERE <-

if (!mongodbUrl) {
  console.log('\x1b[33m%s\x1b[0m','Please set the mongodb connection first in -> "server/models/mongo.config.js"\n');
  return;
}

mongoose.connect(mongodbUrl);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to Database Video Requests');
});

module.exports = mongoose;
