const express = require("express");
const { inType3 } = require("../controllers/inType3");
const router = express.Router();

router.route("/").post(inType3);

module.exports = router;