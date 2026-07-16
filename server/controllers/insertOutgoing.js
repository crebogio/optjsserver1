
const { entryOutgoing, dbInsertSeirenLogs, deleteWIP, checkWIP,checkUser,getBatchNo,dbCheckWIPTruncated,dbGetOutgoingTruncated,dbGetHazaiTruncated,dbEntrySeirenHazai} = require("../db/database");
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
      if(parseFloat(weight) === 0){
         res.status(200).json({error:'Weight cannot be zero'});
         return;
      }
      if(validityTruncated.length === 0){
         res.status(200).json({error:'Invalid not found in WIP'});
      }
      else{
         const lastDashIdx = transNumBatch.lastIndexOf('-');
         const suffix = parseInt(transNumBatch.substring(lastDashIdx + 1), 10);
         const existingOutgoing = await dbGetOutgoingTruncated(transNumBatch, process);
         const existingHazai = await dbGetHazaiTruncated(transNumBatch, process);
         if(suffix !== existingOutgoing.length + existingHazai.length + 1){
            res.status(200).json({error:'Scan consecutive buckets'});
            return;
         }
         const wipWeightTruncated = parseFloat(validityTruncated[0].weight);
         const outgoingSum = existingOutgoing.reduce((sum, row) => sum + parseFloat(row.KGperBuckets), 0);
         const hazaiSum = existingHazai.reduce((sum, row) => sum + parseFloat(row.qty), 0);
         const newTotal = Math.round((outgoingSum + hazaiSum + parseFloat(weight)) * 100) / 100;
         if(newTotal > wipWeightTruncated){
            res.status(200).json({error:'Total weight exceeds WIP weight'});
            return;
         }
         if(results === "GOOD"){
            const itemEntry = await entryOutgoing(process,user, machine, transNum,transNumBatch,results,weight);
         } else {
            const itemEntry = await dbEntrySeirenHazai(transNumBatch,process,weight);
         }
         const logEntry = await dbInsertSeirenLogs("Outgoing", process,"-", machine, transNum,transNumBatch,results,weight,str);
         if(newTotal >= wipWeightTruncated){
            const truncatedBatch = transNumBatch.substring(0, lastDashIdx);
            await deleteWIP(truncatedBatch, "N/A");

         }
         res.status(200).json({message:'Valid'});
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