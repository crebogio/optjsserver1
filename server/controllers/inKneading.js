const { checkSeirenPlan, checkSeirenWIP, checkUser, checkMachine, entryWIP, entryLogs} = require("../db/database");
const CustomError = require("../error/custom-error");

const inKneading = async (req, res) => {
  const { process, user, machine, transNum, transNumBatch  } = req.body;
  
  const isTransNumInPlan = await checkSeirenPlan(transNum);
  const isTransNumInWIP = await checkSeirenWIP(transNum);
  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);

  // if ((isTransNumInPlan.length > 0) && (isTransNumInWIP.length === 0) && (isUserValid.length > 0) && (isMachineValid.length > 0)) {
  //   const itemEntry = await entryWIP(process,user, machine, transNum,transNumBatch);
  //   const logEntry = await entryLogs("WIP", process, user, machine, transNum,transNumBatch, "N/A", "0.0");
  //   res.status(200).json({status: 200,message:'Valid'}); 
  // }
  // else{
  //   res.status(200).json({status: 200,message:'Invalid'});
  // }  

  if (isUserValid.length > 0) {
    if (isMachineValid.length > 0) {
        if (isTransNumInWIP.length === 0){
          if(isTransNumInPlan.length > 0){
            const itemEntry = await entryWIP(process,user, machine, transNum,transNumBatch);
            const logEntry = await entryLogs("WIP", process, user, machine, transNum,transNumBatch, "N/A", "0.0");
            res.status(200).json({message:'Valid'}); 
          }
          else{
            res.status(200).json({error:'Item not in daily plan'});
          }
        }
        else{
          res.status(200).json({error:'Item Already in WIP'});
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

module.exports = { inKneading };