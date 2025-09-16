const {
  checkSeirenPlan,
  checkSeirenWIP,
  check
} = require("../db/database");
const CustomError = require("../error/custom-error");

const checkSeirenKneadVal = async (req, res) => {
  const { transnum } = req.params;
  const isTransNumInPlan = await checkSeirenPlan(transnum);
  const isTransNumInWIP = await checkSeirenWIP(transnum);
  
  if (isTransNumInPlan.length > 0) {
    if(isTransNumInWIP.length === 0){
        res.status(200).json({status: 200,message:'found'});
    }
    else{
        res.status(200).json({status: 200,message:'in WIP'});
    }
  }
  else{
    res.status(200).json({status: 200,message:'not found'});
  }

};


module.exports = { checkSeirenKneadVal };
