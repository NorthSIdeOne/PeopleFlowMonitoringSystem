'use strict';
const node = require('../models/iotDevice.model');

exports.uploadData = function(req, res) {

    const nodeObj = new node();
    nodeObj.uploadData(req,res);

};

exports.getDeviceData=async function(req,res){

    return (await (new node()).getData())
    
}

