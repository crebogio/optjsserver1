const express = require("express");
const { insertOutgoing } = require("../controllers/insertOutgoing");
const router = express.Router();

router.route("/").post(insertOutgoing);

module.exports = router;