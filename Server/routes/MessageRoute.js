const express = require("express");
const router = express.Router();

const { handleCreateNewMessage } = require("../Controller/MessageController");

router.route("/").post(handleCreateNewMessage);

module.exports = router;
