const { dbGetSeikeiWip} = require("../db/database");
const CustomError = require("../error/custom-error");

const getSeikeiWip = async (req, res) => {
  const { ctrl_no} = req.params;
  
  const xx = await dbGetSeikeiWip(ctrl_no);
  res.status(200).json(xx[0]);
  
}

module.exports = { getSeikeiWip };