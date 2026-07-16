const express = require("express");
const { inCutting } = require("../controllers/inCutting");
const router = express.Router();

router.route("/").post(inCutting);

module.exports = router;