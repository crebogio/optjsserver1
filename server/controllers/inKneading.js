const { checkSeirenPlan, checkSeirenWIP,checkSeirenDispatch, checkUser, checkMachine, entryWIP, dbInsertSeirenLogs,checkMixtureTransNum, checkCM, checkBatchNo, checkSeirenLogsTransBatch} = require("../db/database");
const CustomError = require("../error/custom-error");

const inKneading = async (req, res) => {
  const { user, machine, transNum, batchNo, mixture, cm} = req.body;
  
  const isTransNumInPlan = await checkSeirenPlan(transNum);
  const isTransNumInWIP = await checkSeirenWIP(transNum);
  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);
  const isMixtureValid = await checkMixtureTransNum(transNum,mixture);
  const isCMValid = await checkCM(transNum, cm);
  const isTransNumInDispatch = await checkSeirenDispatch(transNum);
  const isCheckBatchNo = await checkBatchNo(batchNo);
  const isTransBatchInLogs = await checkSeirenLogsTransBatch(transNum, batchNo);

  if (isUserValid.length > 0) {
    if (isMachineValid.length > 0) {
        if (isTransNumInWIP.length === 0){
          if(isTransNumInPlan.length > 0){
            if(isTransNumInDispatch.length == 0){
              if(isMixtureValid.length > 0){
                //if(isCheckBatchNo.length === 0){
                  if(isCMValid.length > 0){
                    if(isTransBatchInLogs.length === 0){
                      var qty = 0;
                      for(const row of isTransNumInPlan){
                        qty = row.Quantity;
                      }
                      const itemEntry = await entryWIP("KNEADING",user, machine, transNum,"N/A",batchNo,qty);
                      const logEntry = await dbInsertSeirenLogs("WIP", "KNEADING", user, machine, transNum,"N/A", "N/A", qty,batchNo);
                      res.status(200).json({message:'Valid'});
                    }
                    else{
                      res.status(200).json({error:'Matching transnum and batchno found'});
                    }
                  }
                  else{
                    res.status(200).json({error:'CM not in daily plan'});
                  }
                //}
                //else{
                //    res.status(200).json({error:'invalid batch no.'});
                //}
              }
              else{
                res.status(200).json({error:'Match Mixture with plan'});
              }
            }
            else{
              res.status(200).json({error:'Item Already Dispatched'});
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