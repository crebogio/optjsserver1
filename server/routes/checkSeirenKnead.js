const express = require("express");
const {
  checkSeirenKneadVal
} = require("../controllers/checkSeirenKnead");

const router = express.Router();

router.route("/:transnum").get(checkSeirenKneadVal);

module.exports = router;