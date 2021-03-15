const express = require('express');
const router = express.Router();

const deviceCotroller =   require('../../controller/Node.controller');

/**
 * Insert json information into database.
 */
router.post('/',deviceCotroller.uploadData);

/**
 * Get all data from the databse.
 */
router.get('/',async (req,res)=>{

    res.send(await deviceCotroller.getDeviceData(req,res));
    console.log("Sensor data from database was sent")
});

module.exports = router;