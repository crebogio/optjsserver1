const { checkSeikeiDispatching, checkSeikeiOut,checkSeikeiWIP} = require("../db/database");
const CustomError = require("../error/custom-error");

const inSeikei = async (req, res) => {
  const { ctrl_no} = req.params;
  
  const isCtrlNoInDispatching = await checkSeikeiDispatching(ctrl_no);
  const isCtrlNoInWip = await checkSeikeiWIP(ctrl_no);
  const isCtrlNoInOut = await checkSeikeiOut(ctrl_no);

  if (isCtrlNoInDispatching.length > 0) {
    if (isCtrlNoInOut.length === 0) {
      if (isCtrlNoInWip.length === 0) {
        res.status(200).json({message:'add'});
      }
      else{
        res.status(200).json({message:'modify'});
      }
    }
    else{
      res.status(200).json({error:'Already in OUT'});
    }
  }
  else{
    res.status(200).json({error:'Not in Seiren Dispatching'});
  }  
}

module.exports = { inSeikei };