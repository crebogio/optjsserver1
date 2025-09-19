const express = require("express");
const { updateRheometer } = require("../controllers/updateRheometer");
const router = express.Router();

router.route("/").post(updateRheometer);

module.exports = router;