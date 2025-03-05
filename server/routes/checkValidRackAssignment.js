const express = require("express");
const {
  checkRackM
} = require("../controllers/checkValidRackAssignment");

const router = express.Router();

router.route("/:rack/:itemno").get(checkRackM);

module.exports = router;
