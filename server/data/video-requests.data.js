const VideoRequest = require('./../models/video-requests.model');
const User = require('./../models/user.model');

module.exports = {
  createRequest: async (vidRequestData) => {
    const authorId = vidRequestData.author_id;
    if (authorId) {
      const userObj = await User.findOne({ _id: authorId });
      vidRequestData.author_name = userObj.author_name;
      vidRequestData.author_email = userObj.author_email;
    }
    let newRequest = new VideoRequest(vidRequestData);
    return newRequest.save();
  },

  getAllVideoRequests: (top) => {
    return VideoRequest.find({}).sort({ submit_date: '-1' }).limit(top);
  },

  searchRequests: (topic) => {
    return VideoRequest.find({
      topic_title: { $regex: topic, $options: 'i' },
    }).sort({ addedAt: '-1' });
  },

  getRequestById: (id) => {
    return VideoRequest.findById({ _id: id });
  },

  updateRequest: (id, newVidDetails) => {
    return VideoRequest.findByIdAndUpdate(id, newVidDetails);
  },

  updateVoteForRequest: async (id, vote_type, user_id) => {
    const oldRequest = await VideoRequest.findById({ _id: id });
    const other_type = vote_type === 'ups' ? 'downs' : 'ups';

    const oldVoteList = oldRequest.votes[vote_type];
    const oldOtherList = oldRequest.votes[other_type];

    if (!oldVoteList.includes(user_id)) {
      oldVoteList.push(user_id);
    } else {
      oldVoteList.splice(user_id);
    }

    if (oldOtherList.includes(user_id)) {
      oldOtherList.splice(user_id);
    }

    return VideoRequest.findByIdAndUpdate(
      { _id: id },
      {
        votes: {
          [vote_type]: oldVoteList,
          [other_type]: oldOtherList,
        },
      },
      { new: true }
    );
  },

  deleteRequest: (id) => {
    return VideoRequest.deleteOne({ _id: id });
  },
};
