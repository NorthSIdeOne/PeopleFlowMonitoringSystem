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



