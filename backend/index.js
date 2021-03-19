const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const t = require("./models/ProcessData.model")


const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());
const iotDevice = require('./routes/api/Node');

app.use('/api/sensor_data',iotDevice);

app.get('/', (req, res) => {
    res.send("Hello World");
    var date =  new Date(Date.now() + (2*60*60*1000));
    console.log("[GET]: Home  ["+date.toUTCString()+"]")
  });


const port = process.env.PORT || 5000;

app.listen(port,()=>console.log(`Server started on port ${port}`));