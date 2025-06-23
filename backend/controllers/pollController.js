const User = require("../models/User");
const Poll = require("../models/Poll");

//create new poll
exports.createPoll = async (req, res) => {
  const { question, type, options, creatorId } = req.body;

  if (!question || !type || !creatorId) {
    return res
      .status(400)
      .json({ message: "Question, type and creatorId are required." });
  }

  try {
    let processedOptions = [];
    switch (type) {
      case "single-choice":
        if (!options || options.length < 2) {
          return res.status(400).json({
            message: "Single-Choice polls must have atleast two options.",
          });
        }
        processedOptions = options.map((option) => ({ optionText: option }));
        break;

      case "rating":
        processedOptions = [1, 2, 3, 4, 5].map((value) => ({
          optionText: value.toString(),
        }));
        break;

      case "yes/no":
        processedOptions = ["Yes", "No"].map((option) => ({
          optionText: option,
        }));
        break;

      case "image-based":
        if (!options || options.length < 2) {
          return res.status(400).json({
            message: "Image based poll must have atleast two images.",
          });
        }

        processedOptions = options.map((url) => ({
          optionText: url,
        }));
        break;

      case "open-ended":
        processedOptions = []; // for open-ended polls
        break;

      default:
        return res.status(400).json({ message: "Invalid Poll type." });
    }

    const newPoll = await Poll.create({
      question,
      type,
      options: processedOptions,
      creator: creatorId,
    });

    res.status(201).json(newPoll);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering User", error: error.message });
  }
};

//get all polls
exports.getAllPolls = async (req, res) => {
  const { type, creatorId, page = 1, limit = 10 } = req.query;
  const filter = {};
  const userId = req.user._id;

  if (type) filter.type = type;
  if (creatorId) filter.creator = creatorId;

  try {
    //calculate pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    //fetch polls with pagination
    const polls = await Poll.find(filter)
      .populate("creator", "fullName username email profileImageUrl")
      .populate({
        path: "responses.voterId",
        select: "username profileImageUrl fullName",
      })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    // add 'userHasVoted' flag for each poll
    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );
      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    //get total count of polls for pagination metadata
    const totalPolls = await Poll.countDocuments(filter);

    const stats = await Poll.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    //all types should be included in stats, even those with zero counts
    const allTypes = [
      { type: "single-choice", label: "Single Choice" },
      { type: "yes/no", label: "Yes/No" },
      { type: "rating", label: "Rating" },
      { type: "image-based", label: "Image Based" },
      { type: "open-ended", label: "Open Ended" },
    ];

    const statsWithDefaults = allTypes
      .map((pollType) => {
        const stat = stats.find((item) => item.type === pollType.type);
        return {
          label: pollType.label,
          type: pollType.type,
          count: stat ? stat.count : 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalPolls / pageSize),
      totalPolls,
      stats: statsWithDefaults,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering User", error: error.message });
  }
};

//get all voted polls
exports.getVotedPolls = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;
  try {
    //find pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    //fetch polls where user has voted
    const polls = await Poll.find({ voters: userId })
      .populate("creator", "fullName profileImageUrl username email")
      .populate({
        path: "responses.voterId",
        select: "username profileImageUrl fullName",
      })
      .skip(skip)
      .limit(pageSize);

    //add user has voted flag for each poll
    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );
      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    //total count of voted polls for pagination metadata
    const totalVotedPolls = await Poll.countDocuments({ voters: userId });

    res.status(200).json({
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalVotedPolls / pageSize),
      totalVotedPolls,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering User", error: error.message });
  }
};

//get poll by ID
exports.getPollById = async (req, res) => {
  const { id } = req.params;
  try {
    const poll = await Poll.findById(id)
    .populate("creator", "username email")
    .populate({
        path: "responses.voterId",
        select: "username profileImageUrl fullName",
      });
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json(poll);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering User", error: error.message });
  }
};

// vote poll
exports.voteOnPoll = async (req, res) => {
  const { id } = req.params;
  const { optionIndex, voterId, responseText } = req.body;

  try {
    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({
        message: "Poll Not Found.",
      });
    }

    if (poll.closed) {
      return res.status(400).json({ message: "Poll is closed." });
    }

    if (poll.voters.includes(voterId)) {
      return res
        .status(400)
        .json({ message: "User has already voted on this poll." });
    }

    if (poll.type == "open-ended") {
      if (!responseText) {
        return res
          .status(400)
          .json({ message: "Response Text is required for open-ended polls." });
      }
      poll.responses.push({ voterId, responseText });
    } else {
      if (
        optionIndex === undefined ||
        optionIndex < 0 ||
        optionIndex >= poll.options.length
      ) {
        return res.status(400).json({ message: "Invalid option index." });
      }
      poll.options[optionIndex].votes += 1;
    }

    poll.voters.push(voterId);
    await poll.save();

    res.status(200).json(poll);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering User", error: error.message });
  }
};

//close poll
exports.closePoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll Not Found." });
    }

    if (!poll.creator.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized Action to close this pol." });
    }

    if (poll.closed) {
      return res.status(400).json({ message: "Poll is already closed." });
    }

    poll.closed = true;
    await poll.save();

    return res.status(200).json({ message: "Poll closed successfully.", poll });
  } catch (error) {
    res.status(500).json({
      message: "Error closing poll",
      error: error.message,
    });
  }
};

//Bookmark poll
exports.bookmarkPoll = async (req, res) => {
  const { id } = req.params; //Poll ID
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }

    //check if poll is already bookmarked
    const isBookmarked = user.bookmarkedPolls.includes(id);

    if (isBookmarked) {
      //remove poll from bookmarks
      user.bookmarkedPolls = user.bookmarkedPolls.filter(
        (pollId) => pollId.toString() != id
      );

      await user.save();
      return res.status(200).json({
        message: "Poll removed from Bookmarks",
        bookmarkedPolls: user.bookmarkedPolls,
      });
    }

    // add poll to bookmarks
    user.bookmarkedPolls.push(id);
    await user.save();
    return res.status(200).json({
      message: "Poll bookmarked Successfully.",
      bookmarkedPolls: user.bookmarkedPolls,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering User", error: error.message });
  }
};

//get Bookmarked poll
exports.getBookmarkedPolls = async (req, res) => {
  
  const userId = req.user.id;
  // console.log("User ID:", userId);
// const user = await User.findById(userId).populate({
//     path: "bookmarkedPolls",
//     populate: {
//       path: "creator",
//       select: "fullName username profileImageUrl",
//     },
//   });
// console.log("User Bookmarked Polls (Raw):", user.bookmarkedPolls);
  try {
    const user = await User.findById(userId).populate({
        path: "bookmarkedPolls",
        populate: {
          path: "creator",
          select: "fullName username profileImageUrl",
        },
      });
      // .populate({
      //   path: "bookmarkedPolls",
      //   populate: {
      //     path: "responses.voterId",
      //     select: "fullname username profileImageUrl",
      //   },
      // });

    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }

    //add userhasVoted flag for each poll
    const bookmarkedPolls = user.bookmarkedPolls;
    const updatedPolls = bookmarkedPolls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );

      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    res.status(200).json({ bookmarkedPolls: updatedPolls });
  } catch (error) {
    res.status(500).json({
      message: "Error getting bookmarked Polls",
      error: error.message,
    });
  }
};

//delete poll
exports.deletePoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll Not Found." });
    }

    if (!poll.creator.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized Action." });
    }

    await Poll.findByIdAndDelete(id);

    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering User", error: error.message });
  }
};