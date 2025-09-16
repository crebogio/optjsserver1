const express = require("express");
const {
  checkSeirenUserMachineVal
} = require("../controllers/checkUserMachine");

const router = express.Router();

router.route("/:user/:machine").get(checkSeirenUserMachineVal);

module.exports = router;