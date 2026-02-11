// insert rolling and cutting

const {getBatchNo,getNoOfBucket, checkSeirenOutgoing, deleteOutgoing, entryWIP, entryLogs,checkUser,checkMachine,checkSeirenPlan} = require("../db/database");
const CustomError = require("../error/custom-error");

const inType3 = async (req, res) => {
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
          const firstRow = 60/getNoOfBuckets[0].Trans_Num_Batch;

          const deletedEntry = await deleteOutgoing(transNum, transNumBatch);
          for (let i = 0; i < firstRow; i++) {
            const itemEntry = await entryWIP("CUTTING",user, machine, "N/A",transNum + "-" +(i+1) ,str);
            const logEntry = await entryLogs("WIP", "CUTTING", user, machine, "N/A",transNum + "-" +(i+1), "N/A", "0.0",str);
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