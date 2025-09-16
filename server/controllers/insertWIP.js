
const { entryWIP, checkInputs, entryLogs } = require("../db/database");
const CustomError = require("../error/custom-error");

const insertWIP = async (req, res) => {
  const { process,user,machine,transNum,transNumBatch} = req.body; 

//   const validity = await checkInputs(user_ID, machine_number, item_number)
//   if (validity === 0){
//     throw new CustomError(400, `Invalid inputs ${validity}`);
//   }

  const itemEntry = await entryWIP(process,user, machine, transNum,transNumBatch);
  const logEntry = await entryLogs("WIP", process,user, machine, transNum,transNumBatch,"N/A","0.0");
  res.status(200).json({ message: `log and wip entry:`, logEntry });

};

module.exports = { insertWIP };