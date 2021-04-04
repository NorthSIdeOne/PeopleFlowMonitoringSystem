const express = require('express');
const router = express.Router();

const proccessDataView =   require('../../views/ProcessData.view');


/**
 *  Get an array with all the rooms from the
 *  database
 */

router.get('/rooms',async (req,res)=>{

    res.send(await proccessDataView.getRooms());
    console.log("Get rooms")
});

/**
 *  Get all the data with the number of people from the
 *  database
 */

router.get('/nr_of_people',async (req,res)=>{

    res.send(await proccessDataView.getNrOfPeople());
    console.log("Get nr_of_people")
});

router.get('/room/:name',async (req,res)=>{
    res.send((await proccessDataView.getRoomData(req.params['name'])))
});


module.exports = router;