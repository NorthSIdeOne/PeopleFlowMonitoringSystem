const express = require('express');
const router = express.Router();

const deviceCotroller =   require('../../controller/Node.controller');
const proccessDataController =  require('../../controller/ProccessData.controller');

/**
 * Insert json information into database.
 */
router.post('/',async (req,res) =>{
    await deviceCotroller.uploadData(req,res)
    await  proccessDataController.proccessDataController(req,res);
    console.log("Nu afecteaza ")
});

/**
 * Get all data from the databse.
 */
router.get('/',async (req,res)=>{

    res.send(await deviceCotroller.getDeviceData(req,res));
    console.log("Sensor data from database was sent")
});

module.exports = router;