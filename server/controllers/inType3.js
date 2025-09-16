// insert rolling and cutting

const { checkSeirenOutgoing, deleteOutgoing, entryWIP, entryLogs,checkUser,checkMachine,checkSeirenPlan} = require("../db/database");
const CustomError = require("../error/custom-error");

const inType3 = async (req, res) => {
  const { process, user, machine, transNum, transNumBatch  } = req.body;
  
  const isTransNumInWIP = await checkSeirenOutgoing(transNum);
  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);
  const allSeirenBatch = await checkSeirenPlan(transNum);

  if (isUserValid.length > 0) {
    if (isMachineValid.length > 0) {
        if (isTransNumInWIP.length !== 0) {

            
          const deletedEntry = await deleteOutgoing(transNum, transNumBatch)
          const itemEntry = await entryWIP(process,user, machine, transNum,transNumBatch);
          const logEntry = await entryLogs("WIP", process, user, machine, transNum,transNumBatch, "N/A", "0.0");

          for(const row of allSeirenBatch){
            //console.log(row);

            const itemEntry = await entryWIP(process,user, machine, "N/A",row.Trans_Num_Batch);
            const logEntry = await entryLogs("WIP", process, user, machine, "N/A",row.Trans_Num_Batch, "N/A", "0.0");
          }

          res.status(200).json({message:'Valid'}); 
        }
        else{
          res.status(200).json({error:'not good or missing in ongoing table'});
        }  
    }
    else{
        res.status(200).json({error:'Invalid Machine'});
    }
  }
  else{
    res.status(200).json({error:'Invalid User'});
  }  
}

module.exports = { inType3 };