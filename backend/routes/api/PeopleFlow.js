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

router.get('/room/:name/:date/:time1/:time2',async (req,res)=>{
    res.send((await proccessDataView.getRoomDataForTimeFull(req.params['name'],req.params['date'],req.params['time1'],req.params['time2'])))
});

router.get('/room/:name/:date',async (req,res)=>{
    res.send((await proccessDataView.getRoomDataForSpecificDate(req.params['name'],req.params['date'])))
});




module.exports = router;