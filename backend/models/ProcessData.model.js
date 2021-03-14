'use strict';
const dbCon = require('../database/DATABASE');
const config = require('../config/CONFIGURATION');



let processData = class ProcessDataClass{

    /**
     * Unproccessed data from the database.
     *
     * @type {{RSSI: [], NODE_NAME: [], CH: [], TIME: [], SSID: [], MAC: []}}
     */
    unprocessedData = {
        "MAC"       : [],
        "RSSI"      : [],
        "CH"        : [],
        "SSID"      : [],
        "NODE_NAME" : [],
        "TIME"      : []
    };

    /**
     * Data after the alghoritm is used to proccess the data
     *
     * @type {{LAST_ACTIVE: [], USER: [], ROOM: [], RSSI_AVERAGE: [], SSID: [], MAC: []}}
     */
    processedData = {
        "PERSON_NAME"  : [],
        "LOCATION"     : [],
        "MAC"          : [],
        "RSSI_AVERAGE" : [],
        "SSID"         : [],
        "LAST_ACTIVE"  : []
    }

    /**
     * Number of people in a given period of time in a room.
     *
     * @type {{NR_OF_PEOPLE: [], TIME: [], ROOM: []}}
     */
    numberOfPeople = {
        "LOCATION"     : [],
        "NR_OF_PEOPLE" : [],
        "TIME"         : []
    }

    /**
     * Distinct macs from the database in a given period of time
     *
     * @type {{MAC: []}}
     */
    distinctMAC = {
        "MAC" : []
    }

    /**
     * Information about the nodes(sniffers) :
     * Where are the nodes , the name and the mac of the nodes.
     *
     * @type {{NODE_NAME: [], ROOM: [], MAC: []}}
     */
    nodesInformations = {
        "NODE_NAME" : [],
        "LOCATION"  : [],
        "MAC"       : []
     }

     knownMAC = {
        "MAC": [],
         "PERSON_NAME": []
     }


     GET_UNPROCCESED_DATA  = `SELECT * FROM ${config.COLLECTED_DATA_SNIFFERS} 
                             WHERE RSSI > ${config.MAX_RSSI} AND
                             TIME >= ( NOW() - INTERVAL ${config.GET_DATA_INTERVAL} MINUTE )  
                             ORDER BY ${config.COLLECTED_DATA_SNIFFERS}.TIME  DESC`;

     GET_DISTINCT_MACS     = `SELECT DISTINCT MAC FROM ${config.COLLECTED_DATA_SNIFFERS} 
                             WHERE RSSI > ${config.MAX_RSSI} AND
                             TIME >= ( NOW() - INTERVAL ${config.GET_DATA_INTERVAL} MINUTE )  
                             ORDER BY ${config.COLLECTED_DATA_SNIFFERS}.TIME  DESC`;
     GET_NODE_INFORMATIONS = `SELECT * FROM ${config.NODES_INFORMATIONS}`;

     GET_KNOW_MAC          = `SELECT * FROM ${config.KNOWN_MAC}`;

    INSERT_PROCCESSED_DATA = `INSERT INTO ${config.PROCESSED_DATA} (PERSON_NAME,LOCATION,MAC,RSSI,SSID,LAST_ACTIVE) VALUES (?,?,?,?,?,?)`;
    INSERT_NR_OF_PEOPLE = `INSERT INTO ${config.PEOPLE_FLOW} (ROOM,NR_OF_PEOPLE) VALUES (?,?)`;

    /**
     * Used to extract data from the database
     * and to return it in JSON format
     *
     * @param query: A query to select data from the database
     * @returns Data in JSON format
     */
    async extractData(query){

        return JSON.parse(JSON.stringify( await (new dbCon).queryDatabase(query)));
     }


    async collectData(){

         this.unprocessedData   =  await this.extractData(this.GET_UNPROCCESED_DATA);
         this.distinctMAC       =  await this.extractData(this.GET_DISTINCT_MACS);
         this.nodesInformations =  await this.extractData(this.GET_NODE_INFORMATIONS);
         this.knownMAC          =  await this.extractData(this.GET_KNOW_MAC);

     }


    async processData(){
        await this.collectData();
        this.processedData = await this.formatData(this.unprocessedData,this.nodesInformations,this.distinctMAC,this.knownMAC);
        this.insertProccessedData(this.processedData)

        this.numberOfPeople = await this.estimateNrOfPeople(this.processedData,this.nodesInformations);
        this.insertNumberOfPeople(this.numberOfPeople)
        return this.processedData;
    }


    async estimateNrOfPeople(proccesedData,nodesInformations){

        let numberOfPeople = this.roomDistribution(nodesInformations);
        for(let i in proccesedData)
        {
            for(let j in numberOfPeople){
                if(proccesedData[i].LOCATION === numberOfPeople[j].LOCATION)
                    numberOfPeople[j].NR_OF_PEOPLE +=1;
            }
        }

        return numberOfPeople;
    }

    roomDistribution(nodesInformations){
        let localRoomDistribution = [];

        for(let element of nodesInformations){

            localRoomDistribution.push({
                "LOCATION"     : element.LOCATION,
                "NR_OF_PEOPLE" : 0,
                "TIME"         : ""
            })
        }
        return localRoomDistribution;

    }
   async insertProccessedData(processedData){

        const db = (new dbCon).createQuery();
        try {
            for(let element of  processedData)
                  await db.query( this.INSERT_PROCCESSED_DATA,
                      [element.PERSON_NAME,element.LOCATION,element.MAC,element.RSSI,element.SSID,element.LAST_ACTIVE]);

        } catch (err) {
            console.log(new Error(err.message));
        } finally {
            await db.close();
            console.log("Process data insert successfully!");

        }
    }

    async insertNumberOfPeople(numberOfPeople){

        const db = (new dbCon).createQuery();
        try {
            for(let element of  numberOfPeople)
                await db.query( this.INSERT_NR_OF_PEOPLE, [element.LOCATION,element.NR_OF_PEOPLE]);

        } catch (err) {
            console.log(new Error(err.message));
        } finally {
            await db.close();
            console.log("Nr of people data insert successfully!");

        }
    }
    filterMAC(unproccesedData,nodeInformations){
        let blacklist = []
        let filteredData = []

        nodeInformations.forEach(element => blacklist.push(element.MAC));
        for(var index1 = 0 ; index1 < unproccesedData.length ; index1 ++ )
        {
            for(var index2 =0 ; index2 < blacklist.length;  index2++)
            {
                (unproccesedData[index1].MAC === blacklist[index2]) ? index2 = blacklist.length : filteredData.push(unproccesedData[index1]);
            }
        }

        return  filteredData;

    }

    async formatData(unproccesedData,nodeInformations,distinctMAC,knownMAC){
        let filteredData =  this.filterMAC(unproccesedData,nodeInformations);
        let localProccessedData = [];

        for(var index1 = 0; index1 < distinctMAC.length ;index1++)
        {
            let mac = ""
            let rssi = 0;
            let nrOfRecords = 0;
            let ssid = "";
            let nodeName = "";
            let lastTimeActive = "";


            for(var index2 = 0; index2 < filteredData.length ;index2++)
            {
                if(distinctMAC[index1].MAC === filteredData[index2].MAC){
                    rssi += filteredData[index2].RSSI;
                    nrOfRecords+=1;
                    if(mac === "")
                        mac = filteredData[index2].MAC;
                    if(filteredData[index2] !== "")
                        ssid = filteredData[index2].SSID;
                    if(lastTimeActive === "" || lastTimeActive < filteredData[index2].TIME)
                        lastTimeActive = filteredData[index2].TIME;
                    if(nodeName === "")
                        nodeName = filteredData[index2].NODE_NAME;
                }
            }


            localProccessedData.push({
                    "PERSON_NAME"  : this.getPersonName(mac,knownMAC),
                    "LOCATION"     : this.getLocation(nodeName,nodeInformations),
                    "MAC"          : mac,
                    "RSSI"         : Math.round(rssi/nrOfRecords),
                    "SSID"         : ssid,
                    "LAST_ACTIVE"  : lastTimeActive
            })
        }

        return localProccessedData;
    }

    getLocation(nodeName,nodeInformations){
        let location = ""
        nodeInformations.forEach(element => ((element.NODE_NAME === nodeName) && location === "") ? location=element.LOCATION : false);
        return location;
    }

    getPersonName(mac,knownMAC){
        let personName = "Unknown";
        knownMAC.forEach(elemement => ((elemement.MAC === mac) && personName === "Unknown") ? personName = elemement.PERSON_NAME : false);
        return personName;
    }

}

let t = (new processData());
t.processData();