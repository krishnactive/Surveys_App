const User = require("../models/User");
const Poll = require("../models/Polls");

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