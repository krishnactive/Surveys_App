const { Parser } = require("json2csv");
const Poll = require("../models/Poll");

function optionData(poll) {
  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
  return poll.options.map(opt => ({
    PollId: poll._id.toString(),
    Question: poll.question,
    Type: poll.type,
    CreatorUsername: poll.creator?.username || "",
    Option: opt.optionText,
    Votes: opt.votes || 0,
    VotePercentage: totalVotes ? ((opt.votes / totalVotes) * 100).toFixed(2) + "%" : "0%",
    TotalVoters: poll.voters.length,
    TotalOptions: poll.options.length,
    PollCreatedAt: poll.createdAt,
    Closed: poll.closed,
    ExportedAt: new Date().toISOString()
  }));
}

function openEndedData(poll) {
  return poll.responses.map(r => ({
    PollId: poll._id.toString(),
    Question: poll.question,
    Type: poll.type,
    CreatorUsername: poll.creator?.username || "",
    Response: r.responseText,
    VoterId: r.voterId?.toString() || "",
    ResponseCreatedAt: r.createdAt,
    TotalResponses: poll.responses.length,
    PollCreatedAt: poll.createdAt,
    Closed: poll.closed,
    ExportedAt: new Date().toISOString()
  }));
}

exports.downloadPollResults = async (req, res) => {
  const pollId = req.params.id;
  const format = req.query.format || "csv";

  try {
    const poll = await Poll.findById(pollId).populate("creator", "username");
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    let data = poll.type === "open-ended"
      ? openEndedData(poll)
      : optionData(poll);

    if (!data.length) {
      return res.status(200).json({ message: "Poll has no data to export." });
    }

    const fileSafeName = poll.question.replace(/[^a-z0-9]/gi, "_").substring(0, 50);

    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header("Content-Type", "text/csv");
      res.attachment(`${fileSafeName}.csv`);
      return res.send(csv);
    } else if (format === "json") {
      res.header("Content-Type", "application/json");
      res.attachment(`${fileSafeName}.json`);
      return res.send(JSON.stringify(data, null, 2));
    } else {
      return res.status(400).json({ message: "Invalid format" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
