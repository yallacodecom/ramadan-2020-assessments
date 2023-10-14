var mongoose = require('./mongo.config');

if (!Object.keys(mongoose).length) return;

var VideoRequestsSchema = mongoose.Schema(
  {
    author_name: String,
    author_email: String,
    topic_title: String,
    topic_details: String,
    expected_result: String,
    votes: {
      ups: { type: Array, default: [] },
      downs: { type: Array, default: [] },
    },
    target_level: { type: String, default: 'beginner' },
    status: { type: String, default: 'new' },
    video_ref: {
      link: { type: String, default: '' },
      date: { type: String, default: '' },
    },
  },
  { timestamps: { createdAt: 'submit_date', updatedAt: 'update_date' } }
);

var videoRequestsModel = mongoose.model('VideoRequests', VideoRequestsSchema);
module.exports = videoRequestsModel;
