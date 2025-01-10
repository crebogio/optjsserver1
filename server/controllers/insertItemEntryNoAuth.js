const { addProduct, getUserWithIdOf,addItemEntry } = require("../db/database");
const CustomError = require("../error/custom-error");

const insertItemEntry = async (req, res) => {
  let { ctlNo, processType, addressNo, quantity, user } = req.body;
  //if (!sub_type) sub_type = null;
  //if (sub_type) {
  //  if (!Number(sub_type))
  //    throw new CustomError(400, "sub_type must be of type int");
  //}
  //if (type) {
  //  if (!Number(type)) throw new CustomError(400, "type must be of type int");
  //}

  // const { username } = await getUserWithIdOf(req.user);
  const itemEntry = await addItemEntry(ctlNo, processType, addressNo, quantity,user);
  res.status(200).json({ message: "product stat", itemEntry });
};

module.exports = { insertItemEntry };
