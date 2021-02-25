const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());
const iotDevice = require('./routes/api/iotDevice');

app.use('/api/sensor_data',iotDevice);

app.get('/', (req, res) => {
    res.send("Hello World");
  });


const port = process.env.PORT || 5000;

app.listen(port,()=>console.log(`Server started on port ${port}`));