
const { dbCheckSeikeiEmployee, dbCheckSeikeiMachine,dbInsertSeikeiWip} = require("../db/database");
const CustomError = require("../error/custom-error");

const insertSeikeiWip = async (req, res) => {
  const { ctrl_no,item_no,mold_no,batch_no,lot_no,machine,employee,start_time} = req.body; 

  const isEmployeeValid = await dbCheckSeikeiEmployee(employee);
  const isMachineValid = await dbCheckSeikeiMachine(machine);

  if (isEmployeeValid.length > 0) {
    if (isMachineValid.length > 0) {
          const itemEntry = await dbInsertSeikeiWip(ctrl_no,item_no, mold_no, batch_no,lot_no,machine,employee,start_time);
          res.status(200).json({message:'Insert WIP Ok'}); 
    }
    else{
        res.status(200).json({error:'Invalid Machine'});
    }
  }
  else{
    res.status(200).json({error:'Invalid User'});
  }  

};

module.exports = { insertSeikeiWip };