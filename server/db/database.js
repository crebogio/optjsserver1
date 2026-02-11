const mysql = require("mysql2");
require("express-async-errors");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const getRacks = async () => {
  const [rows] = await pool.query("SELECT * FROM tbl_seiren_rackmasterlist");
  return rows;
};

const getRack = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM tbl_seiren_rackmasterlist WHERE rack_id = ?`,
    [id]
  );
  return rows;
};

const getUser = async (username) => {
  const [[user] = rows] = await pool.query(
    `SELECT * FROM ctech_users WHERE username = ?`,
    [username]
  );

  return user;
};

const getUserWithIdOf = async (id) => {
  const [[user] = rows] = await pool.query(
    `SELECT * FROM ctech_users WHERE id = ?`,
    [id]
  );

  return user;
};

const addProduct = async (barcode, type, sub_type, user) => {
  const [rows] = await pool.query(
    "INSERT INTO `ctech_products_stat` (`barcode`, `type`, `sub_type`, `user`) VALUES (?,?,?,?)",
    [barcode, type, sub_type, user]
  );

  return rows;
};

const getProductsList = async (barcode) => {
  const [rows] = await pool.query(
    "SELECT  * FROM `ctech_products_list` WHERE barcode = ?",
    [barcode]
  );

  return rows;
};

const getIncomingList = async (barcode) => {
  const [rows] = await pool.query(
    "SELECT  * FROM (SELECT * FROM tbl_seiren_fifotag WHERE NOT EXISTS(SELECT opt_ctech_merge_table.CTLNO FROM opt_ctech_merge_table WHERE tbl_seiren_fifotag.Recordnum=opt_ctech_merge_table.CTLNO)) AS a WHERE a.Recordnum = ?",
    [barcode]
  );

  return rows;
};

const checkRackV1 = async (inRackNo,inCode) => {
  const [rows] = await pool.query(
    "SELECT * FROM (SELECT  * FROM tbl_seiren_actual_arrive WHERE (tbl_seiren_actual_arrive.AddressNo = ? AND tbl_seiren_actual_arrive.Balance != 0 AND EXISTS (SELECT * FROM tbl_seiren_rackmasterlist WHERE tbl_seiren_rackmasterlist.rack_addressno = ?)))AS a WHERE (a.Code = ?)",
    [inRackNo,inRackNo,inCode]
  );
  return rows;
};

const checkRackV2 = async (inRackNo) => {
  const [rows] = await pool.query(
    "SELECT * FROM tbl_seiren_rackmasterlist WHERE (tbl_seiren_rackmasterlist.rack_addressno = ? AND (NOT EXISTS (SELECT * FROM tbl_seiren_actual_arrive WHERE tbl_seiren_actual_arrive.AddressNo = ?) OR (NOT EXISTS(SELECT * FROM tbl_seiren_actual_arrive WHERE tbl_seiren_actual_arrive.AddressNo= ? AND tbl_seiren_actual_arrive.balance != 0))))",
    [inRackNo,inRackNo,inRackNo]
  );
  return rows;
};



const addItemEntry = async (ctlNo, processType, addressNo,quantity, user, destination, comments) => {
  const [rows] = await pool.query(
    "INSERT INTO `opt_ctech_merge_table` (`CTLNO`, `processType`, `AddressNo`, `quantity`,`user`,`destination`,`comments`) VALUES (?,?,?,?,?,?,?)",
    [ctlNo, processType, addressNo,quantity, user, destination, comments ]
  );

  return rows;
};

const getRackList = async (addressNo) => {
  const [rows] = await pool.query(
    "SELECT  * FROM `tbl_seiren_actual_arrive` WHERE (CTLNO = ?) AND (Balance != 0)  ",
    [addressNo]
  );

  return rows;
};

// checks validity of user ID, machine ID, and record ID
const checkInputs = async(user_ID, machine_number, item_number) => {
  const [exists] = await pool.query(
    "SELECT EXISTS (SELECT 1 FROM `tbl_seiren_test_users` WHERE ID = ?) AND EXISTS (SELECT 1 FROM `tbl_seiren_test_machine` WHERE ID = ?) AND EXISTS (SELECT 1 FROM `tbl_seiren_daily_sched` WHERE RecordID = ?)",
    [user_ID, machine_number, item_number]
  )
  
  const rows = Object.values(exists[0])[0];

  return rows
}

// Logs all changes on the WIP and outgoing tables
const entryLogs = async(direction, process,user, machine, transNum,transNumBatch,status,weight,batchno) => {
  const[rows] = await pool.query(
    "INSERT INTO `opt_ctech_seiren_logs` (`direction`, `Process`, `UserID`, `MachineNum`, `TransNum`, `TransNumBatch`, `Status`, `KGperBuckets`,`BatchNo`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [direction, process,user, machine, transNum,transNumBatch,status,weight,batchno]
  );

  return rows
}

// adds to WIP table
const entryWIP = async (process,user, machine, transNum,transNumBatch,BatchNo) => {
  const [rows] = await pool.query(
    "INSERT INTO `opt_ctech_seiren_WIP` (`Process`, `UserID`, `MachineNumber`,`TransNum`, `TransNumBatch`,`BatchNo`) VALUES (?,?,?,?,?,?)",
    [process,user, machine, transNum,transNumBatch,BatchNo]
  );

  return rows
}

const checkSeirenPlan = async (transNum) => {
  const [rows] = await pool.query(
    "SELECT * FROM tbl_seiren_daily_sched_control WHERE (Trans_Num = ?)",
    [transNum]
  );
  return rows;
};

const checkSeirenWIP = async (transNum) => {
  const [rows] = await pool.query(
    "SELECT * FROM opt_ctech_seiren_WIP a WHERE (a.TransNum = ?)",
    [transNum]
  );
  return rows;
};

const checkSeirenDispatch = async (transNum) => {
  const [rows] = await pool.query(
    "SELECT * FROM opt_ctech_seiren_dispatching WHERE TransNumBatch LIKE CONCAT(?, '%')",
    [transNum]
  );
  return rows;
};

const checkSeirenOutgoing = async (transNum) => {
  const [rows] = await pool.query(
    "SELECT * FROM opt_ctech_seiren_outgoing a WHERE (a.TransNum = ?) AND (Status = ?)",
    [transNum, "Good"]
  );
  return rows;
};

const checkSeirenOutgoingType2 = async (transNumBatch) => {
  const [rows] = await pool.query(
    "SELECT * FROM opt_ctech_seiren_outgoing a WHERE (a.TransNumBatch = ?) AND (Status = ?)",
    [transNumBatch, "Good"]
  );
  return rows;
};

const checkBatchNo = async (batchno) => {
  const [rows] = await pool.query(
    "SELECT * FROM opt_ctech_seiren_logs a WHERE (a.BatchNo = ?)",
    [batchno]
  );
  return rows;
};

const checkMachine = async (machineVal) => {
  const [rows] = await pool.query(
    "SELECT * FROM tbl_seikei_all_machine_list a WHERE (a.equipno = ?)",
    [machineVal]
  );
  return rows;
};


const checkUser = async (idVal) => {
  const [rows] = await pool.query(
    "SELECT * FROM tboperatorlist a WHERE (a.id = ?)",
    [idVal]
  );
  return rows;
};

const getOrigin = async (transNum) => {
  const [rows] = await pool.query(
    "SELECT a.Origin FROM tbl_seiren_daily_sched_control a WHERE (a.Trans_Num = ?)",
    [transNum]
  );
  return rows;
};

const getBatchNo = async (transNum) => {
  const [rows] = await pool.query(
    "SELECT a.BatchNo FROM opt_ctech_seiren_logs a WHERE (a.TransNum = ?)",
    [transNum]
  );
  return rows;
};

const entryRheoLogs = async (transNum,user, machine, result) => {
  const [rows] = await pool.query(
    "INSERT INTO `opt_ctech_seiren_rheo_logs` (`TransNum`, `UserID` , `MachineNum` , `Result`) VALUES (?,?,?,?)",
    [transNum,user, machine, result]
  );
  return rows
}

const deleteRheoLogs = async (transNum) => {
  const [rows] = await pool.query(
    "DELETE FROM `opt_ctech_seiren_rheo_logs` WHERE `TransNum` = ?",
    [transNum]
  );
  return rows
}

const entryDispatching = async (transNumBatch,user,batchno,weight,origin) => {
  const [rows] = await pool.query(
    "INSERT INTO `opt_ctech_seiren_dispatching` ( `TransNumBatch`,`UserID`, `BatchNo`,`KGperBuckets`,`Origin`) VALUES (?,?,?,?,?)",
    [transNumBatch,user,batchno,weight,origin]
  );

  return rows
}

const entryOutgoing = async (process,user, machine, transNum,transNumBatch,results,weight) => {
  const [rows] = await pool.query(
    "INSERT INTO `opt_ctech_seiren_outgoing` (`PrevProcess`, `UserID`, `MachineNumber`, `TransNum`,`TransNumBatch`,`Status`,`KGperBuckets`) VALUES (?,?,?,?,?,?,?)",
    [process,user, machine, transNum,transNumBatch,results,weight]
  );

  return rows
}

const deleteWIP = async(transNum,transNumBatch) => {
  const[rows] = await pool.query(
    "DELETE FROM `opt_ctech_seiren_WIP` WHERE `TransNum` = ? AND `TransNumBatch` = ? LIMIT 1",
    [transNum,transNumBatch]
  );

  return rows
}

const deleteOutgoing = async(transNum,transNumBatch) => {
  const[rows] = await pool.query(
    "DELETE FROM `opt_ctech_seiren_outgoing` WHERE `TransNum` = ? AND `TransNumBatch` = ? LIMIT 1",
    [transNum,transNumBatch]
  );

  return rows
}

const checkWIP = async(transNum,transNumBatch, process) => {
  const[rows] = await pool.query(
    "SELECT 1 FROM `opt_ctech_seiren_WIP` WHERE `TransNum` = ? AND `TransNumBatch` = ? AND `Process` = ?",
    [transNum,transNumBatch, process]
  );
  return rows
}


const checkMixtureTransNum = async(transNum,mixture) => {
  const[rows] = await pool.query(
    "SELECT 1 FROM `tbl_seiren_daily_sched_control` WHERE `Trans_Num` = ? AND `Mixture` = ? ",
    [transNum,mixture]
  );
  return rows
}

const getNoOfBucket = async(transNum) => {
  const[rows] = await pool.query(
    "SELECT a.Trans_Num_Batch FROM `tbl_seiren_daily_sched_control` a WHERE `Trans_Num` = ?",
    [transNum]
  );
  return rows
}

const checkCM = async(transNum, cm) => {
  const[rows] = await pool.query(
    "SELECT * FROM `tbl_seiren_daily_sched_control` WHERE `Trans_Num` = ? AND `CM` = ? ",
    [transNum, cm]
  );
  return rows
}



const checkOutgoingCuttingPass = async(transNum) => {
  const[rows] = await pool.query(
    "SELECT * FROM `opt_ctech_seiren_outgoing` WHERE `PrevProcess` = ? AND `Status` = ? AND `TransNumBatch` = ? ",
    ['CUTTING','GOOD',transNum,]
  );
  return rows
}
const checkRheoPass = async(transNum) => {
  const[rows] = await pool.query(
    "SELECT * FROM `opt_ctech_seiren_rheo_logs` WHERE  `Result` = ? AND `TransNum` = ? ",
    ['PASS',transNum]
  );
  return rows
}


module.exports = {
  getRacks,
  getRack,
  getUser,
  addProduct,
  getUserWithIdOf,
  getProductsList,
  getIncomingList,
  addItemEntry,
  getRackList,
  checkRackV1,
  checkRackV2,
  checkInputs,
  entryLogs,
  entryWIP,
  checkCM,
  checkSeirenPlan,
  checkSeirenWIP,
  checkSeirenDispatch,
  checkSeirenOutgoing,
  checkSeirenOutgoingType2,
  checkMachine,
  checkUser,
  entryOutgoing,
  deleteWIP,
  deleteOutgoing,
  checkWIP,
  checkMixtureTransNum,
  getOrigin, 
  getBatchNo,
  entryRheoLogs,
  deleteRheoLogs,
  entryDispatching,
  getNoOfBucket,
  checkOutgoingCuttingPass,
  checkRheoPass,
  checkBatchNo
};
