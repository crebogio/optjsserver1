const express = require("express");
const { insertDispatching } = require("../controllers/insertDispatching");
const router = express.Router();

router.route("/").post(insertDispatching);

module.exports = router;