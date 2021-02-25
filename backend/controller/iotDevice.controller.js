'use strict';
const device = require('../models/iotDevice.model');

exports.uploadData = function(req, res) {
    
    device.uploadData(req,res);

};

exports.getDeviceData=function(req,res){
   
    device.getDeviceData(req,res);
    
}

