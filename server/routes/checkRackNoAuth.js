const express = require("express");
const {
  getOneRackList
} = require("../controllers/checkRackNoAuth");

const router = express.Router();

router.route("/:addressNo").get(getOneRackList);

module.exports = router;
