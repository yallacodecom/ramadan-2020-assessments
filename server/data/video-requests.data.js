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

  getAllVideoRequests: (filterBy) => {
    const filter = filterBy === 'all' ? {} : { status: filterBy };
    return VideoRequest.find(filter).sort({ submit_date: '-1' });
  },

  searchRequests: (topic, filterBy) => {
    const filter = filterBy === 'all' ? {} : { status: filterBy };
    return VideoRequest.find({
      topic_title: { $regex: topic, $options: 'i' },
      ...filter,
    }).sort({ addedAt: '-1' });
  },

  getRequestById: (id) => {
    return VideoRequest.findById({ _id: id });
  },

  updateRequest: (id, status, resVideo) => {
    const updates = {
      status: status,
      video_ref: {
        link: resVideo,
        date: resVideo && new Date(),
      },
    };

    return VideoRequest.findByIdAndUpdate(id, updates, { new: true });
  },

  updateVoteForRequest: async (id, vote_type, user_id) => {
    const oldRequest = await VideoRequest.findById({ _id: id });
    const other_type = vote_type === 'ups' ? 'downs' : 'ups';

    const oldVoteList = oldRequest.votes[vote_type];
    const otherVoteList = oldRequest.votes[other_type];

    if (!oldVoteList.includes(user_id)) {
      oldVoteList.push(user_id);
    } else {
      oldVoteList.splice(user_id);
    }
    if (otherVoteList.includes(user_id)) {
      otherVoteList.splice(user_id);
    }
    return VideoRequest.findByIdAndUpdate(
      { _id: id },
      {
        votes: {
          [vote_type]: oldVoteList,
          [other_type]: otherVoteList,
        },
      },
      { new: true } // By default it returns the old object before update
    );
  },

  deleteRequest: (id) => {
    return VideoRequest.deleteOne({ _id: id });
  },
};
