
const { entryOutgoing, dbInsertSeirenLogs, deleteWIP, checkWIP,checkUser,getBatchNo,dbCheckWIPTruncated} = require("../db/database");
const CustomError = require("../error/custom-error");

const insertOutgoing = async (req, res) => {
   const { process, user, machine, transNum, transNumBatch, results, weight} = req.body; 

   const validity =  await checkWIP(transNum, transNumBatch, process);
   const validityTruncated =  await dbCheckWIPTruncated(transNumBatch, process);
   const batchEntry = await getBatchNo(transNum);
   var str ='';
   for(const row of batchEntry){
      str=row.BatchNo;
   }
   if(process === "CUTTING"){
       if(validityTruncated.length === 0){
         res.status(200).json({error:'Invalid not found in WIP'}); 
      }
      else{

      }

   }else{
      if(validity.length === 0){
         res.status(200).json({error:'Invalid not found in WIP'}); 
      }
      else{
         const wipWeight = validity[0].weight;
         const deletedEntry = await deleteWIP(transNum,transNumBatch);
         const itemEntry = await entryOutgoing(process,user, machine, transNum,transNumBatch,results,wipWeight);
         const logEntry = await dbInsertSeirenLogs("Outgoing", process,"-", machine, transNum,transNumBatch,results,wipWeight,str);
         res.status(200).json({message:'Valid'});
      }
   }
};

module.exports = { insertOutgoing };


// const { checkWIP, deleteWIP, entryOutgoing, dbInsertSeirenLogs } = require("../db/database");
// const CustomError = require("../error/custom-error");

// const out = async (req, res) => {
//   const { user_ID, process, item_number, machine_number} = req.body; 
    
//   // Validates inputs
//   const validity = await checkWIP(user_ID, process, item_number, machine_number)
//   if (validity.length === 0){
//     throw new CustomError(400, `Inputs not found`);
//   }
  
//   // Deletes entry from WIP
//   const deletedEntry = await deleteWIP(user_ID, process, item_number, machine_number)

//   // Adds entry to Outgoing
//   const itemEntry = await entryOutgoing(user_ID, process, item_number, machine_number)

//   // Adds entry to Logs
//   const logEntry = await dbInsertSeirenLogs(`Outgoing`, user_ID, item_number, machine_number, process)
//   res.status(200).json({ message: `product stat`, deletedEntry, itemEntry, logEntry })
// };

// module.exports = { out };