const express = require("express");
const { 
  myTest 
} = require("../controllers/myTest");

const router = express.Router();

router.route("/:ctrl_no").get(myTest);

module.exports = router;
