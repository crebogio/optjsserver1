const { checkSeirenPlan, checkSeirenWIP, checkUser, checkMachine, entryWIP, entryLogs,checkMixtureTransNum, checkCM} = require("../db/database");
const CustomError = require("../error/custom-error");

const inKneading = async (req, res) => {
  const { user, machine, transNum, batchNo, mixture, cm} = req.body;
  
  const isTransNumInPlan = await checkSeirenPlan(transNum);
  const isTransNumInWIP = await checkSeirenWIP(transNum);
  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);
  const isMixtureValid = await checkMixtureTransNum(transNum,mixture);
  const isCMValid = await checkCM(transNum, cm)

  if (isUserValid.length > 0) {
    if (isMachineValid.length > 0) {
        if (isTransNumInWIP.length === 0){
          if(isTransNumInPlan.length > 0){
            if(isMixtureValid.length > 0){
              if(isCMValid.length > 0){
                const itemEntry = await entryWIP("KNEADING",user, machine, transNum,"N/A",batchNo);
                const logEntry = await entryLogs("WIP", "KNEADING", user, machine, transNum,"N/A", "N/A", "0.0",batchNo);
                res.status(200).json({message:'Valid'});
              }
              else{
                res.status(200).json({error:'CM not in daily plan'});
              }
            }
            else{
              res.status(200).json({error:'Match Mixture with plan'});
            }
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