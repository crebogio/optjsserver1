const express = require("express");
const { inKneading } = require("../controllers/inKneading");
const router = express.Router();

router.route("/").post(inKneading);

module.exports = router;