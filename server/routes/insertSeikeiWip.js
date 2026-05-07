const express = require("express");
const { insertSeikeiWip } = require("../controllers/insertSeikeiWip");
const router = express.Router();


router.route("/").post(insertSeikeiWip);

module.exports = router;