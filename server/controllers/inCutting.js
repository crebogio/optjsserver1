// insert rolling and cutting

const {getBatchNo,getNoOfBucket, checkSeirenOutgoing, deleteOutgoing, entryWIP, dbInsertSeirenLogs,checkUser,checkMachine,checkSeirenPlan} = require("../db/database");
const CustomError = require("../error/custom-error");

const inCutting = async (req, res) => {
  const { process, user, machine, transNum, transNumBatch  } = req.body;
  
  const isTransNumInWIP = await checkSeirenOutgoing(transNum);
  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);
  const getNoOfBuckets = await getNoOfBucket(transNum);
  if (isUserValid.length > 0) {
    if (isMachineValid.length > 0) {
        if (isTransNumInWIP.length !== 0) {
          const batchEntry = await getBatchNo(transNum);
          var str ='';
          for(const row of batchEntry){
              str=row.BatchNo;
          }
          const outWeight = isTransNumInWIP[0].KGperBuckets;
          const deletedEntry = await deleteOutgoing(transNum, transNumBatch);
          const itemEntry = await entryWIP("CUTTING",user, machine, transNum,"N/A" ,str,outWeight);
          const logEntry = await dbInsertSeirenLogs("WIP", "CUTTING", user, machine, transNum,"N/A", "N/A", "0.0",str);
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

module.exports = { inCutting };