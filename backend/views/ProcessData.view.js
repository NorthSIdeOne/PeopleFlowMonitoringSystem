'use strict';
const dbCon = require('../database/DATABASE');
const config = require('../config/CONFIGURATION');

const GET_PROCESSEDDATA = `SELECT * FROM ${config.PROCESSED_DATA} ORDER BY LAST_ACTIVE DESC`;
const GET_ROOMS = `SELECT DISTINCT ROOM FROM ${config.PEOPLE_FLOW}`;

exports.getProcessedData =async function() {

    return await (new dbCon).queryDatabase(GET_PROCESSEDDATA);

};

exports.getRooms =async function() {

    return await (new dbCon).queryDatabase(GET_ROOMS);

};

