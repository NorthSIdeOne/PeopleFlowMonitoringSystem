'use strict';
const dbCon = require('../config/db.config');
const config = require('../config/configurationFile');


let node = class NodeClass{

    mac  = [];
    rssi = [];
    ch   = [];
    ssid = [];
    nodeName = "Unknown";

    INSERT_QUERY = `INSERT INTO ${config.COLLECTED_DATA_SNIFFERS} (MAC,RSSI,CH,SSID,NODE_NAME) VALUES (?,?,?,?,?)`;
    SELECT_QUERY = `SELECT * FROM ${config.COLLECTED_DATA_SNIFFERS}`;

    INSERT_SUCCESFULL_MESSAGE = "Insert succesfully!";
    SELECT_SUCCESFULL_MESSAGE = "Select query success!"
    UPLOAD_DATA_SUCCESSFUL    = "Data was upload to the database."

    /**
     * This function populate mac,rssi,ch,ssid arrays
     * from this class.
     *
     * @param data json that contains all informations recived
     *        from request.
     */
    addData(data){

        this.nodeName = "Unknown";
        try {
            data.forEach(element =>{
                this.mac.push(element.MAC);
                this.rssi.push(element.RSSI);
                this.ch.push(element.CH);
                this.ssid.push(element.SSID);
                this.nodeName = element.NODE_NAME;
            })
        }
        catch (err) {
            console.log("ERROR at reading data from node : "+ err.message);

        }
    }

    /**
     * This function is used to delete all the
     * data stored in the class arrays.
     */
    deleteData(){
        try {
            this.mac  = [];
            this.rssi = [];
            this.ch   = [];
            this.ssid = [];
            this.nodeName = "Unknown";
        }
        catch (err){
            console.log(err.message);
        }

    }

    /**
     *  This function is used to get all the data from the
     *  database.
     *
     */
    async getData() {

        const db = (new dbCon).queryDataBase();

        try {
            return  await db.query(this.SELECT_QUERY);
        } catch (err) {
            console.log(new Error(err.message));
        } finally {
            await db.close();
            console.log(this.SELECT_SUCCESFULL_MESSAGE);
        }

    }

    /**
     * This function is used to insert data in the database.
     * The data used for insertion is the data from the arrays.
     *
     */
    async insertData(){

        var values = [];
        for (var i = 0; i < this.mac.length; i++) {
            values[i] = [this.mac[i], this.rssi[i], this.ch[i], this.ssid[i] ,this.nodeName];
        }

        const db = (new dbCon).queryDataBase();
        try {
            for (const elements of values) {
                await db.query(this.INSERT_QUERY,elements);
            }
        } catch (err) {
            console.log(new Error(err.message));
        } finally {
            await db.close();
            console.log(this.INSERT_SUCCESFULL_MESSAGE);

        }
    }

    /**
     *   This function is used to upload data in the database.
     * The data is recived as request,the information is used in
     * addData(data) and after that it continue with insertion and
     * empty the arrays.
     *
     * @param req request
     * @param res response
     */
     async uploadData(req,res){
         try {
             this.addData(req.body)
             await this.insertData()
                 .then(this.deleteData())
                 .then(console.log(this.UPLOAD_DATA_SUCCESSFUL))
                 .then(res.sendStatus(200));
         }
         catch (err){
             console.log("ERROR AT UPLOAD DATA");
             console.log(err.message);
         }
    }

}


module.exports = node;