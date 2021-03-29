const express = require('express');
const router = express.Router();

const deviceCotroller =   require('../../controller/Node.controller');
const proccessDataView =   require('../../views/ProcessData.view');
const proccessDataController =  require('../../controller/ProccessData.controller');

/**
 * Insert json information into database.
 */
router.post('/',async (req,res) =>{
    await deviceCotroller.uploadData(req,res)
    await  proccessDataController.proccessDataController(req,res);

});


/**
 * Get all data from the databse.
 */
router.get('/',async (req,res)=>{

    res.send(await deviceCotroller.getDeviceData(req,res));
    console.log("Sensor data from database was sent")
});


router.get('/process_data',async (req,res)=>{

    res.send(await proccessDataView.getProcessedData());
    console.log("PROCESSED_DATA")
});

module.exports = router;