const { dbMyTest} = require("../db/database");
const CustomError = require("../error/custom-error");

const myTest = async (req, res) => {
    const { ctrl_no} = req.params;
  
    const isDbMyTestValid = await dbMyTest(ctrl_no);
  

    if (isDbMyTestValid.length > 0) {
        res.status(200).json({message:'valid'});
    }

    else{
        res.status(200).json({error:'Not Found'});
    }

}

module.exports = { myTest };