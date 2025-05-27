const {
  checkRackV1,
  checkRackV2
} = require("../db/database");
const CustomError = require("../error/custom-error");

const checkRackM = async (req, res) => {
  const { rack,itemno} = req.params;
  const isRackOccupiedByItem = await checkRackV1(rack,itemno);
  const isRackEmpty = await checkRackV2(rack);
//hello
  
  if (isRackEmpty.length === 1) {
    res.status(200).json({status: 200,message:'Rack Empty'});
  }
  else{
    if (isRackOccupiedByItem.length >= 1) {
      res.status(200).json({status: 200,message:'Occupied by same item'});
    }
    else{
      res.status(200).json({status: 404,message:'Item cannot occupy the rack'});
    }

  }
  
  
};


module.exports = { checkRackM };
