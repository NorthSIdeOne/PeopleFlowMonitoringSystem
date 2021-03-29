const express = require('express');
const router = express.Router();

const proccessDataView =   require('../../views/ProcessData.view');


/**
 * Get all processed data from the data base
 * and send it as response
 */
router.get('/',async (req,res)=>{

    res.send(await proccessDataView.getProcessedData());
    console.log("PROCESSED_DATA")
});


module.exports = router;