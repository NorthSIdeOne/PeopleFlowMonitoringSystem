const express = require('express');
const router = express.Router();

const proccessDataView =   require('../../views/ProcessData.view');


/**
 * Get all node configurations from the data base
 * and send it as response
 */
router.get('/',async (req,res)=>{

    res.send(await proccessDataView.getAllowList());
    console.log("Allow list")
});

router.post('/update',async (req,res) =>{

    proccessDataView.updateAllowList(req,res)
    res.sendStatus(200)
});
router.post('/insert',async (req,res) =>{

    proccessDataView.insertAllowList(req,res)
    res.sendStatus(200)
});
router.post('/delete',async (req,res) =>{

    await proccessDataView.deleteAllowList(req,res)
    res.sendStatus(200)
});
router.post('/disable',async (req,res) =>{

    await proccessDataView.disableAll(req,res)
    res.sendStatus(200)
});
router.post('/enable',async (req,res) =>{

    await proccessDataView.enableAll(req,res)
    res.sendStatus(200)
});

router.get('/countEnable',async (req,res)=>{

    res.send(await proccessDataView.countEnable(req,res));
    console.log("Allow list count")

});

module.exports = router;