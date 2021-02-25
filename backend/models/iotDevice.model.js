'use strict';
const dbCon = require('../config/db.config');

var device = 
{
    MAC:[],
    RSSI:[],
    CH:[],
    SSID:[],

    addData:function(data){
        data.forEach(element => {
            this.MAC.push(element.MAC);
            this.RSSI.push(element.RSSI);
            this.CH.push(element.CH);
            this.SSID.push(element.SSID);
        }); 
    },
    insertData:function(){

        var i=0;
        while(i < this.MAC.length)
        {
            //Create query
            var query = "INSERT INTO sniffer (MAC,RSSI,CH,SSID) VALUES (?,?,?,?);";
            //Add data
            var values = [this.MAC[i],this.RSSI[i],this.CH[i],this.SSID[i]];
            //Insert data
            dbCon.query(query,values);
            i++;
        }

        
        console.log("Insert succesfully");
    },
    deleteData:function(){
        this.MAC  = [];
        this.RSSI = [];
        this.CH   = [];
        this.SSID = [];
    },
    getData:function(req,res){
        var query = "SELECT * FROM sniffer";
        dbCon.query(query, (error, results) => {
            if (error) {
              return console.error(error.message);
            }
           res.send(results) 
        });
        
    }

}

//Insert data into DB
device.uploadData = function(req,res){
        
    device.addData(req.body)
    device.insertData();
    device.deleteData();
    res.sendStatus(200);
    
}
//Get all data from DB
device.getDeviceData = function(req,res){
    device.getData(req,res)
}

module.exports = device;