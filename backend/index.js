const express = require('express');
const bodyParser = require('body-parser');
const iotDevice = require('./routes/api/Node');
const processData =  require('./routes/api/ProcessedData');
const peopleFlow =  require('./routes/api/PeopleFlow');
const nodeConfiguration = require('./routes/api/NodeConfigurations');
const cors = require('cors');



const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());


app.use('/api/sensor_data',iotDevice);
app.use('/api/process_data',processData);
app.use('/api/people_flow',peopleFlow);
app.use('/api/node_configurations',nodeConfiguration);

app.get('/', (req, res) => {
    res.send("Hello World");
    var date =  new Date(Date.now() + (2*60*60*1000));
    console.log("[GET]: Home  ["+date.toUTCString()+"]")
  });


const port = process.env.PORT || 5000;

app.listen(port,()=>console.log(`Server started on port ${port}`));