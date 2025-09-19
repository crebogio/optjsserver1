// insert rolling and cutting

const {getBatchNo,checkSeirenPlan,entryLogs,entryRheoLogs,deleteRheoLogs,checkUser,checkMachine} = require("../db/database");
const CustomError = require("../error/custom-error");

const updateRheometer = async (req, res) => {
  const { user, machine, transNum,result } = req.body;

  const isTransNumInPlan = await checkSeirenPlan(transNum);

  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);
  if (isUserValid.length > 0) {
    if (isMachineValid.length > 0) {
        if (isTransNumInPlan.length > 0) {
            const batchEntry = await getBatchNo(transNum);
            var str ='';
            for(const row of batchEntry){
                str=row.BatchNo;
            }
            deleteRheoLogs(transNum);
            const logEntry = await entryLogs("Outgoing", "RHEOMETER", user, machine, transNum,"N/A", result, "0.0",str);
            entryRheoLogs(transNum,user,machine,result);
            res.status(200).json({message:'valid'});
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

module.exports = { updateRheometer };