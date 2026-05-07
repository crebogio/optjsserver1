const express = require("express");
const { insertSeikeiOut } = require("../controllers/insertSeikeiOut");
const router = express.Router();

router.route("/").post(insertSeikeiOut);

module.exports = router;