'use strict';
const dbCon = require('../database/DATABASE');
const config = require('../config/CONFIGURATION');

const GET_PROCESSEDDATA  = `SELECT * FROM ${config.PROCESSED_DATA} ORDER BY LAST_ACTIVE DESC`;
const GET_ROOMS          = `SELECT DISTINCT ROOM FROM ${config.PEOPLE_FLOW}`;
const GET_NR_OF_PEOPLE   = `SELECT *  FROM ${config.PEOPLE_FLOW}`;


/**
 *  Get all the processed data from the database
 *
 * @returns {Promise<*>}
 */
exports.getProcessedData =async function() {

    return await (new dbCon).queryDatabase(GET_PROCESSEDDATA);

};
/**
 *  Get an array with all the rooms from the
 *  database
 */

exports.getRooms =async function() {

    return await (new dbCon).queryDatabase(GET_ROOMS);

};

/**
 *  Get all the data with the number of people from the
 *  database
 */

exports.getNrOfPeople =async function() {

    return await (new dbCon).queryDatabase(GET_NR_OF_PEOPLE);

};

exports.getRoomData =async function(room){

    const GET_ROOM_DATA = `SELECT *  FROM ${config.PEOPLE_FLOW} WHERE ROOM='${room}'`;
    return await (new dbCon).queryDatabase(GET_ROOM_DATA);
}

exports.getRoomDataForTimeFull = async function(room,date,time1,time2){

    const GET_ROOM_DATA_BY_TIME = `SELECT *  FROM ${config.PEOPLE_FLOW} WHERE ROOM='${room}' AND
                                    TIME >= '${date} ${time1}' AND TIME <= '${date} ${time2}'`;
    return await (new dbCon).queryDatabase(GET_ROOM_DATA_BY_TIME);
}

exports.getRoomDataForSpecificDate = async function(room,date){

    const GET_ROOM_DATA_BY_TIME = `SELECT *  FROM ${config.PEOPLE_FLOW} WHERE ROOM='${room}' AND
                                    TIME  BETWEEN '${date} 00:00:00.00' AND '${date} 23:59:59.999'`;
    return await (new dbCon).queryDatabase(GET_ROOM_DATA_BY_TIME);
}


exports.getNodeConfigurations = async function(){
    const GET_NODES_INFORMATIONS = `SELECT *  FROM ${config.NODES_INFORMATIONS}`;
    return await (new dbCon).queryDatabase(GET_NODES_INFORMATIONS);
}

exports.updateNodeConfiguration =async function(req,res){

  const UPDATE_NODE_CONFIGURATION =`UPDATE ${config.NODES_INFORMATIONS} SET
                                      NODE_NAME="${req.body['newData']['NODE_NAME']}",
                                      MAC="${req.body['newData']['MAC']}",
                                      LOCATION="${req.body['newData']['LOCATION']}",
                                      SNIFFING_TIME="${req.body['newData']['SNIFFING_TIME']}",
                                      CHANNEL_HOPPING="${req.body['newData']['CHANNEL_HOPPING']}"
                                      WHERE NODE_NAME="${req.body['oldData']['NODE_NAME']}"AND
                                      MAC="${req.body['oldData']['MAC']}" 
                                      AND LOCATION="${req.body['oldData']['LOCATION']}"
                                      AND SNIFFING_TIME="${req.body['oldData']['SNIFFING_TIME']}"
                                      AND CHANNEL_HOPPING="${req.body['oldData']['CHANNEL_HOPPING']}"`
    await (new dbCon).queryDatabase(UPDATE_NODE_CONFIGURATION);

};

exports.deleteNodeConfiguration =async function(req,res){

    const DELETE_NODE_CONFIGURATION =`DELETE FROM ${config.NODES_INFORMATIONS} 
                                      WHERE NODE_NAME="${req.body['data']['NODE_NAME']}"AND
                                      MAC="${req.body['data']['MAC']}" 
                                      AND LOCATION="${req.body['data']['LOCATION']}"
                                      AND SNIFFING_TIME="${req.body['data']['SNIFFING_TIME']}"
                                      AND CHANNEL_HOPPING="${req.body['data']['CHANNEL_HOPPING']}"`

    await (new dbCon).queryDatabase(DELETE_NODE_CONFIGURATION);
};


exports.insertNodeConfiguration =async function(req,res){

    const INSERT_NODE_CONFIGURATION =`INSERT INTO ${config.NODES_INFORMATIONS} (NODE_NAME,MAC,LOCATION,SNIFFING_TIME,CHANNEL_HOPPING) 
                                     VALUES ("${req.body['data']['NODE_NAME']}","${req.body['data']['MAC']}","${req.body['data']['LOCATION']}","${req.body['data']['SNIFFING_TIME']}","${req.body['data']['CHANNEL_HOPPING']}")`;

    console.log(INSERT_NODE_CONFIGURATION)
    await (new dbCon).queryDatabase(INSERT_NODE_CONFIGURATION);
};

exports.getAllowList = async function(){
    const GET_ALLOW_LIST = `SELECT *  FROM ${config.ALLOWLIST}`;
    return await (new dbCon).queryDatabase(GET_ALLOW_LIST);
}

exports.updateAllowList =async function(req,res){

    const UPDATE_ALLOW_LIST =`UPDATE ${config.ALLOWLIST} SET
                                      NAME="${req.body['newData']['NAME']}",
                                      MAC="${req.body['newData']['MAC']}",
                                      Activated="${req.body['newData']['Activated']}"
                                      WHERE NAME="${req.body['oldData']['NAME']}"AND
                                      MAC="${req.body['oldData']['MAC']}" AND
                                      Activated="${req.body['oldData']['Activated']}"`

    await (new dbCon).queryDatabase(UPDATE_ALLOW_LIST);

};

exports.insertAllowList =async function(req,res){

    const INSERT_ALLOW_LIST =`INSERT INTO ${config.ALLOWLIST} (NAME,MAC,Activated) 
                                     VALUES ("${req.body['data']['NAME']}","${req.body['data']['MAC']}","${req.body['data']['Activated']}")`;

    console.log(INSERT_ALLOW_LIST)
    await (new dbCon).queryDatabase(INSERT_ALLOW_LIST);
};

exports.deleteAllowList =async function(req,res){

    const DELETE_ALLOW_LIST =`DELETE FROM ${config.ALLOWLIST} 
                                      WHERE NAME="${req.body['data']['NAME']}"AND
                                      MAC="${req.body['data']['MAC']}" 
                                      AND Activated="${req.body['data']['Activated']}"`

    await (new dbCon).queryDatabase(DELETE_ALLOW_LIST);
};

exports.disableAll =async function(req,res){

    const DISABLE =`UPDATE ${config.ALLOWLIST} SET
                                      Activated="0"
                                      WHERE Activated="1"`

    await (new dbCon).queryDatabase(DISABLE);
};

exports.enableAll =async function(req,res){

    const ENABLE =`UPDATE ${config.ALLOWLIST} SET
                                      Activated="1"
                                      WHERE Activated="0"`

    await (new dbCon).queryDatabase(ENABLE);
};

exports.countEnable =async function(req,res){

    const ENABLE =`SELECT COUNT(NAME) ${config.ALLOWLIST} SET
                                      Activated="1"
                                      WHERE Activated="0"`

    await (new dbCon).queryDatabase(ENABLE);
};

