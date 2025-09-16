// insert rolling and cutting

const { checkSeirenOutgoing, deleteOutgoing, entryWIP, entryLogs} = require("../db/database");
const CustomError = require("../error/custom-error");

const inType1 = async (req, res) => {
  const { process, user, machine, transNum, transNumBatch  } = req.body;
  
  const isTransNumInWIP = await checkSeirenOutgoing(transNum);

  if (isTransNumInWIP.length !== 0) {
    const deletedEntry = await deleteOutgoing(transNum, transNumBatch)
    const itemEntry = await entryWIP(process,user, machine, transNum,transNumBatch);
    const logEntry = await entryLogs("WIP", process, user, machine, transNum,transNumBatch, "N/A", "0.0");
    res.status(200).json({status: 200,message:'Valid'}); 
  }
  else{
    res.status(200).json({status: 200,message:'Invalid'});
  }  
}

module.exports = { inType1 };