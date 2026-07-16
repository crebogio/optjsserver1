// insert rolling and cutting

const {getBatchNo, checkSeirenOutgoing, deleteOutgoing, entryWIP, dbInsertSeirenLogs, dbInsertSeirenLogsHazai, checkSeirenHazai, updateSeirenHazaiAvailability, checkUser,checkMachine} = require("../db/database");
const CustomError = require("../error/custom-error");

const inRolling = async (req, res) => {
  const { process, user, machine, transNum, transNumBatch,hazai  } = req.body;
  
  const isTransNumInWIP = await checkSeirenOutgoing(transNum);
  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);


  if (isUserValid.length > 0) {
    if (isMachineValid.length > 0) {
        if (isTransNumInWIP.length !== 0) {
          const batchEntry = await getBatchNo(transNum);
          var str ='';
          for(const row of batchEntry){
              str=row.BatchNo;
          }
          if (hazai === "N/A") {
            var outWeight = 0;
            for(const row of isTransNumInWIP){
              outWeight = row.KGperBuckets;
            }
            const logEntry = await dbInsertSeirenLogs("WIP", process, user, machine, transNum,transNumBatch, "N/A", outWeight,str);
            const deletedEntry = await deleteOutgoing(transNum, transNumBatch)
            const itemEntry = await entryWIP(process,user, machine, transNum,transNumBatch,str,outWeight);
            res.status(200).json({message:'Valid'});
          } else {
            const hazaiValid = await checkSeirenHazai(hazai);
            if (hazaiValid.length === 0) {
              res.status(200).json({error:'Invalid hazai'});
            }
            else {
              var outWeight = 0;
              for(const row of isTransNumInWIP){
                outWeight = row.KGperBuckets;
              }
              var hazaiWeight = 0;
              for(const row of hazaiValid){
                hazaiWeight = row.qty;
              }
              const totalWeight = parseFloat(outWeight) + parseFloat(hazaiWeight);
              const logEntry = await dbInsertSeirenLogsHazai("WIP", process, user, machine, transNum,transNumBatch, "N/A", totalWeight,str, "R", hazai);
              const deletedEntry = await deleteOutgoing(transNum, transNumBatch)
              const itemEntry = await entryWIP(process,user, machine, transNum,transNumBatch,str,totalWeight);
              const hazaiUpdate = await updateSeirenHazaiAvailability(hazai);
              res.status(200).json({message:'Valid'});
            }
          }
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

module.exports = { inRolling };