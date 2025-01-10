const {
  addProduct,
  getUserWithIdOf,
  checkBarcode,
  getProductsList,
  getIncomingList,
  getRackList
  
} = require("../db/database");
const CustomError = require("../error/custom-error");

const getOneRackList = async (req, res) => {
  const { addressNo } = req.params;
  const product = await getRackList(addressNo);
  if (product.length === 0) {
    throw new CustomError(404, "Item doesn't exist");
  }
  res.status(200).json({ product });
};


module.exports = { getOneRackList };
