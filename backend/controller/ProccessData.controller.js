'use strict';
const proccess = require('../models/ProcessData.model');

exports.proccessDataController =async function(req, res) {

    const proccessObj = new proccess();
    proccessObj.processData();


};