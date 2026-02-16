
const { entryOutgoing, entryLogs, deleteWIP, checkWIP,checkUser,getBatchNo} = require("../db/database");
const CustomError = require("../error/custom-error");

const insertOutgoing = async (req, res) => {
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
         const itemEntry = await entryOutgoing(process,user, machine, transNum,transNumBatch,results,weight);
         const logEntry = await entryLogs("Outgoing", process,"-", machine, transNum,transNumBatch,results,weight,str);
         res.status(200).json({message:'Valid'}); 
      }
   //}
   //else{
   //   res.status(200).json({error:'Invalid User'});
   //}  
};

module.exports = { insertOutgoing };


// const { checkWIP, deleteWIP, entryOutgoing, entryLogs } = require("../db/database");
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
//   const logEntry = await entryLogs(`Outgoing`, user_ID, item_number, machine_number, process)
//   res.status(200).json({ message: `product stat`, deletedEntry, itemEntry, logEntry })
// };

// module.exports = { out };