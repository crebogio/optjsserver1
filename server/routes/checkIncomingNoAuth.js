const express = require("express");
const {
  getOneProductsList
} = require("../controllers/checkIncomingNoAuth");

const router = express.Router();

router.route("/:barcode").get(getOneProductsList);

module.exports = router;
