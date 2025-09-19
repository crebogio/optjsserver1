const {deleteOutgoing,checkRheoPass,checkOutgoingCuttingPass, checkUser, getBatchNo, entryLogs,entryDispatching, getOrigin} = require("../db/database");
const CustomError = require("../error/custom-error");

const insertDispatching = async (req, res) => {
  const { user, transNum  } = req.body;
  const isUserValid = await checkUser(user);

  let index = transNum.lastIndexOf('-');
  let transNumTruncated = index !== -1 ? transNum.slice(0, index) : transNum;
  
  const isPassingRheo = await checkRheoPass(transNumTruncated);
  const isItemInOngoing = await checkOutgoingCuttingPass(transNum)

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
    var str2 = '';
    for(const row of isItemInOngoing){
        str2=row.KGperBuckets;
    }
            
    // console.log(user);
    // console.log(transNumTruncated);
    // console.log(str1);
    // console.log(str);
    // console.log(str2);



  if (isUserValid.length > 0) {

    if (isItemInOngoing.length >0){
        if (isPassingRheo.length >0){
            // const batchEntry = await getBatchNo(transNumTruncated);
            // var str ='';
            // for(const row of batchEntry){
            //     str=row.BatchNo;
            // }

            // const originEntry = await getBatchNo(transNumTruncated);
            // var str1 ='';
            // for(const row of originEntry){
            //     str1=row.Origin;
            // }
            // var str2 = '';
            // for(const row of isItemInOngoing){
            //     str2=row.KGperBuckets;
            // }
            
            // Console.log(user);

            // Console.log(str1);
            // Console.log(str);
            // Console.log(str2);
            const deleteEntry = await deleteOutgoing("N/A",transNum);
            const itemEntry = await entryDispatching(transNum,user,str,str2,str1);
            const logEntry = await entryLogs("Outgoing", "DISPATCHING", user, "N/A", "N/A",transNum, "PASS", str2,str);

            res.status(200).json({message:'Valid'}); 
        }
        else{
            res.status(200).json({error:'Check Rheometer Test'}); 
        }

    }
    else{
        res.status(200).json({error:'Item not ready for dispatching'});
    }
    

        //const itemEntry = await entryDispatching("KNEADING",user, machine, transNum,"N/A",batchNo);
        //const logEntry = await entryLogs("WIP", "KNEADING", user, machine, transNum,"N/A", "N/A", "0.0",batchNo);
        

  }
  else{
    res.status(200).json({error:'Invalid User'});
  }  
}

module.exports = { insertDispatching };