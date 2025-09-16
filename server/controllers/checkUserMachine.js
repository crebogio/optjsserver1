const {
  checkUser,
  checkMachine,
  check
} = require("../db/database");
const CustomError = require("../error/custom-error");

const checkSeirenUserMachineVal = async (req, res) => {
  const { user,machine } = req.params;
  const isUserValid = await checkUser(user);
  const isMachineValid = await checkMachine(machine);
  
  if (isUserValid.length > 0) {
    if(isMachineValid.length > 0){
        res.status(200).json({status: 200,message:'valid'});
    }
    else{
        res.status(200).json({status: 200,message:'invalid machine'});
    }
  }
  else{
    res.status(200).json({status: 200,message:'invalid user'});
  }

};


module.exports = { checkSeirenUserMachineVal };
