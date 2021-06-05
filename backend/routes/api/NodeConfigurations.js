const express = require('express');
const router = express.Router();

const proccessDataView =   require('../../views/ProcessData.view');


/**
 * Get all node configurations from the data base
 * and send it as response
 */
router.get('/',async (req,res)=>{

    res.send(await proccessDataView.getNodeConfigurations());
    console.log("Node Configuration")
});

router.post('/update',async (req,res) =>{

    proccessDataView.updateNodeConfiguration(req,res)
    res.sendStatus(200)
});
router.post('/insert',async (req,res) =>{

    proccessDataView.insertNodeConfiguration(req,res)
    res.sendStatus(200)
});
router.post('/delete',async (req,res) =>{

    await proccessDataView.deleteNodeConfiguration(req,res)
    res.sendStatus(200)
});

module.exports = router;