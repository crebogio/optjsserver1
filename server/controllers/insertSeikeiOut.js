
const { dbDeleteSeikeiWip, dbInsertSeikeiOut} = require("../db/database");
const CustomError = require("../error/custom-error");

const insertSeikeiOut = async (req, res) => {
  const { ctrl_no,item_no, mold_no, batch_no,machine,employee,start_time,end_time,no_of_shots,produce_count,reject_count,reject_type} = req.body; 

  const xx = await dbDeleteSeikeiWip(ctrl_no);
  const yy = await dbInsertSeikeiOut(ctrl_no,item_no, mold_no, batch_no,machine,employee,start_time,end_time,no_of_shots,produce_count,reject_count,reject_type);
  res.status(200).json({message:'Insert Out Ok'}); 
  
};

module.exports = { insertSeikeiOut };