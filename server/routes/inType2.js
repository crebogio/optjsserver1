const express = require("express");
const { inType2 } = require("../controllers/inType2");
const router = express.Router();

router.route("/").post(inType2);

module.exports = router;