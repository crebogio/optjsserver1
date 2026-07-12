const express = require("express");
const { inRolling } = require("../controllers/inRolling");
const router = express.Router();

router.route("/").post(inRolling);

module.exports = router;