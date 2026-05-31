const {deleteOutgoing,checkRheoPass,checkOutgoingCuttingPass, checkUser, getBatchNo, entryLogs,entryDispatching, getOrigin} = require("../db/database");
const CustomError = require("../error/custom-error");

const insertDispatching = async (req, res) => {
  const { user, transNum  } = req.body;
  const isUserValid = await checkUser(user);

  let index = transNum.lastIndexOf('-');
  let transNumTruncated = index !== -1 ? transNum.slice(0, index) : transNum;
  
  const isPassingRheo = await checkRheoPass(transNumTruncated);
  const isItemInOngoing = await checkOutgoingCuttingPass(transNumTruncated);

  const batchEntry = await getBatchNo(transNumTruncated);
  var str ='';
  for(const row of batchEntry){
    str=row.BatchNo;
  }
  const originEntry = await getOrigin(transNumTruncated);
  var str1 ='';
  for(const row of originEntry){
    str1=row.Origin;
  }

  if (isUserValid.length > 0) {

    if (isItemInOngoing.length >0){
        if (isPassingRheo.length >0){

            for (const row of isItemInOngoing) {
              const str2 = row.KGperBuckets;
              await deleteOutgoing("N/A", transNumTruncated);
              await entryDispatching(transNumTruncated, user, str, str2, str1);
              await entryLogs("Outgoing", "DISPATCHING", user, "N/A", "N/A", transNumTruncated, "PASS", str2, str);
            }

            res.status(200).json({message:'Valid'});
        }
        else{
            res.status(200).json({error:'Check Rheometer Test'});
        }

    }
    else{
        res.status(200).json({error:'Item not ready for dispatching'});
    }

  }
  else{
    res.status(200).json({error:'Invalid User'});
  }  
}

module.exports = { insertDispatching };