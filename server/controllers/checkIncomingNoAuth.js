const {
  addProduct,
  getUserWithIdOf,
  checkBarcode,
  getProductsList,
  getIncomingList
} = require("../db/database");
const CustomError = require("../error/custom-error");

const getOneProductsList = async (req, res) => {
  const { barcode } = req.params;
  const product = await getIncomingList(barcode);
  if (product.length === 0) {
    throw new CustomError(404, "Item doesn't exist");
  }
  res.status(200).json({ product });
};


module.exports = { getOneProductsList };
