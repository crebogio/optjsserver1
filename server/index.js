const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");
const authRouter = require("./routes/auth");
const authentication = require("./middlewares/authentication");
const productsStatRouter = require("./routes/productsStat");
const productsStatNoAuthRouter = require("./routes/productsStatNoAuth");
const productsListNoAuthRouter = require("./routes/productsListNoAuth");
const checkIncomingNoAuthRouter = require("./routes/checkIncomingNoAuth");
const insertItemEntryNoAuthRouter = require("./routes/insertItemEntryNoAuth");
const checkRackNoAuthRouter = require("./routes/checkRackNoAuth");
const checkValidRackRouter = require("./routes/checkValidRackAssignment");
const checkSeirenKnead = require("./routes/checkSeirenKnead");
const checkSeirenUserMachine = require("./routes/checkSeirenUserMachine");
const insertWIP = require("./routes/insertWIP");
const insertOutgoing = require("./routes/insertOutgoing");
const inKneading = require("./routes/inKneading");
const inType1 = require("./routes/inType1");
const inType2 = require("./routes/inType2");
const inType3 = require("./routes/inType3");
require("express-async-errors");
require("dotenv").config();

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTES
app.get("/", async (req, res) => {
  res.status(200).send("hello from optilabel");
  console.log("hello from optilabel");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products-stat", authentication, productsStatRouter);
app.use("/api/v1/products-stat-no-auth", productsStatNoAuthRouter);
app.use("/api/v1/products-list-no-auth", productsListNoAuthRouter);
app.use("/api/v1/check-incoming-no-auth", checkIncomingNoAuthRouter);
app.use("/api/v1/insert-item-entry-no-auth", insertItemEntryNoAuthRouter);
app.use("/api/v1/check-rack-no-auth", checkRackNoAuthRouter);
app.use("/api/v1/checkvalidrackassignment", checkValidRackRouter);
app.use("/api/v1/checkSeirenKnead", checkSeirenKnead);
app.use("/api/v1/checkSeirenUserMachine", checkSeirenUserMachine);
app.use("/api/v1/insertWIP", insertWIP);
app.use("/api/v1/insertOutgoing", insertOutgoing);
app.use("/api/v1/inKneading", inKneading);
app.use("/api/v1/inType1", inType1);
app.use("/api/v1/inType2", inType2);
app.use("/api/v1/inType3", inType3);
app.use(notFound);
app.use(errorHandler);

// SERVER CONNECTION
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log("Server Listening on Port " + port)
);
