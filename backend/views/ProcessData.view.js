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


