const express = require('express');
const router = express.Router();

const proccessDataView =   require('../../views/ProcessData.view');



router.get('/rooms',async (req,res)=>{

    res.send(await proccessDataView.getRooms());
    console.log("Get rooms")
});


module.exports = router;