const express = require("express");
const router = express.Router();
const { downloadPollResults } = require("../controllers/downloadController");

router.get("/:id/download", downloadPollResults);

module.exports = router;
