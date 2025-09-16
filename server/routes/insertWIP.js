const express = require("express");
const { insertWIP } = require("../controllers/insertWIP");
const router = express.Router();

router.route("/").post(insertWIP);

module.exports = router;