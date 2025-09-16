const express = require("express");
const { inType1 } = require("../controllers/inType1");
const router = express.Router();

router.route("/").post(inType1);

module.exports = router;