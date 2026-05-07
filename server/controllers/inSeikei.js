const { checkSeikeiPrintMaster, checkSeikeiOut,checkSeikeiWIP,checkSeikeiWIPPaused} = require("../db/database");
const CustomError = require("../error/custom-error");

const inSeikei = async (req, res) => {
  const { ctrl_no} = req.params;
  
  const isCtrlNoInPrintMaster = await checkSeikeiPrintMaster(ctrl_no);
  const isCtrlNoInWip = await checkSeikeiWIP(ctrl_no);
  const isCtrlNoInOut = await checkSeikeiOut(ctrl_no);
  const isCtrlNoPaused= await checkSeikeiWIPPaused(ctrl_no);

  if (isCtrlNoInPrintMaster.length > 0) {
    if (isCtrlNoInOut.length === 0) {
      if (isCtrlNoInWip.length === 0) {
        const { ITMCD, MOLDNO } = isCtrlNoInPrintMaster[0];
        res.status(200).json({item_no: ITMCD,mold_no: MOLDNO});
      }
      else{
        if(isCtrlNoPaused.length === 0){
          res.status(200).json({message:'modify'});
        }
        else{
          res.status(200).json({message:'continue'});
        }
      }
    }
    else{
      res.status(200).json({error:'Already in OUT'});
    }
  }
  else{
    res.status(200).json({error:'Not in Print Master'});
  }  
}

module.exports = { inSeikei };