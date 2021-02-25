const express = require('express');
const router = express.Router();

const deviceCotroller =   require('../../controller/iotDevice.controller');

//Insert data from sniffer into database
router.post('/',deviceCotroller.uploadData);

router.get('/',(req,res)=>{
    console.log("Sensor data from database was sent")
    deviceCotroller.getDeviceData(req,res);
});

module.exports = router;