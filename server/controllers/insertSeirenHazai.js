
const { entryOutgoing, dbInsertSeirenLogs, deleteWIP, checkWIP,checkUser,getBatchNo,dbEntrySeirenHazai} = require("../db/database");
const CustomError = require("../error/custom-error");

const insertSeirenHazai = async (req, res) => {
   const { process, user, machine, transNum, transNumBatch, results, weight} = req.body; 

   const validity =  await checkWIP(transNum, transNumBatch, process);
   //const isUserValid = await checkUser(user);

   //if (isUserValid.length > 0) {
      if(validity.length === 0){
         res.status(200).json({error:'Invalid not found in WIP'}); 
      }
      else{
         const batchEntry = await getBatchNo(transNum);
         var str ='';
         for(const row of batchEntry){
            str=row.BatchNo;
         }

         const deletedEntry = await deleteWIP(transNum,transNumBatch);
         const itemEntry = await dbEntrySeirenHazai(transNumBatch,process,weight);
         const logEntry = await dbInsertSeirenLogs("Outgoing", process,"-", machine, transNum,transNumBatch,results,weight,str);
         res.status(200).json({message:'Valid'}); 
      }
   //}
   //else{
   //   res.status(200).json({error:'Invalid User'});
   //}  
};

module.exports = { insertSeirenHazai };

