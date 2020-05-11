var VideoRequest = require("./../models/video-requests.model");

module.exports = {
  createRequest: (vidRequestData) => {
    let newRequest = new VideoRequest(vidRequestData);
    return newRequest.save();
  },

  getAllVideoRequests: (query) => {
    const sortBy =
      query.sortBy && query.sortBy !== "voting"
        ? { ["votes.voting"]: "-1" }
        : { submit_date: "-1" };

    const topicTitle = query.topic_title
      ? { topic_title: query.topic_title }
      : undefined;

    return VideoRequest.find(topicTitle)
      .sort(sortBy)
      .limit(parseInt(query.size, 10));
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

  updateVoteForRequest: async (id, vote_type) => {
    const oldRequest = await VideoRequest.findById({ _id: id });
    const other_type = vote_type === "ups" ? "downs" : "ups";
    return VideoRequest.findByIdAndUpdate(
      { _id: id },
      {
        votes: {
          [vote_type]: ++oldRequest.votes[vote_type],
          [other_type]: oldRequest.votes[other_type],
        },
      },
      { new: true }
    );
  },

  deleteRequest: (id) => {
    return VideoRequest.deleteOne({ _id: id });
  },
};
