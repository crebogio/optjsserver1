const express = require("express");
const { 
  getSeikeiWip 
} = require("../controllers/getSeikeiWip");

const router = express.Router();

router.route("/:ctrl_no").get(getSeikeiWip);

module.exports = router;
