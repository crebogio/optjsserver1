const express = require("express");
const { insertItemEntry } = require("../controllers/insertItemEntryNoAuth");

const router = express.Router();

router.route("/").post(insertItemEntry);

module.exports = router;
