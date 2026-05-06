const express = require("express");
const { inSeikei } = require("../controllers/inSeikei");

const router = express.Router();

router.route("/:ctrl_no").get(inSeikei);

module.exports = router;
