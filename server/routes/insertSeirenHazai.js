const express = require("express");
const { insertSeirenHazai } = require("../controllers/insertSeirenHazai");
const router = express.Router();

router.route("/").post(insertSeirenHazai);

module.exports = router;