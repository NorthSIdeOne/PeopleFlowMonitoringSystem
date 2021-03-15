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


    /**
     * Query to get data from the database where the
     * RSSI > trash hold and from the last 'GET_DATA_INTERVAL'
     * minutes orderd by the time DESC.
     *
     * @ GET_UNPROCCESED_DAT {string}
     */
     GET_UNPROCCESED_DATA  = `SELECT * FROM ${config.COLLECTED_DATA_SNIFFERS} 
                             WHERE RSSI > ${config.MAX_RSSI} AND
                             TIME >= ( NOW() - INTERVAL ${config.GET_DATA_INTERVAL} MINUTE )  
                             ORDER BY ${config.COLLECTED_DATA_SNIFFERS}.TIME  DESC`;

    /**
     * Query for selectic distinc macs from the database
     * where the RSSI > trash hold and from the last
     * 'GET_DATA_INTERVAL' minutes orderd by the time DESC.
     *
     * @GET_DISTINCT_MACS {string}
     */
     GET_DISTINCT_MACS     = `SELECT DISTINCT MAC FROM ${config.COLLECTED_DATA_SNIFFERS} 
                             WHERE RSSI > ${config.MAX_RSSI} AND
                             TIME >= ( NOW() - INTERVAL ${config.GET_DATA_INTERVAL} MINUTE )  
                             ORDER BY ${config.COLLECTED_DATA_SNIFFERS}.TIME  DESC`;

    /**
     * Query to get all nodes information from the databse
     * | MAC | NAME | TIME |
     *
     * @GET_NODE_INFORMATIONS {string}
     */
    GET_NODE_INFORMATIONS = `SELECT * FROM ${config.NODES_INFORMATIONS}`;

    /**
     * Query to get all the know MACS from the
     * database.
     *
     * @GET_KNOW_MAC {string}
     */

    GET_KNOW_MAC          = `SELECT * FROM ${config.KNOWN_MAC}`;

    /**
     * Query to insert proccessed data into the database
     * @config.PROCESSED_DATA {The table in which proccessed data is inserted}
     */
    INSERT_PROCCESSED_DATA = `INSERT INTO ${config.PROCESSED_DATA} (PERSON_NAME,LOCATION,MAC,RSSI,SSID,LAST_ACTIVE) VALUES (?,?,?,?,?,?)`;

    /**
     * Query to insert nr of people into the database
     *
     * @config.PEOPLE_FLOW {The table in which nr of people  is inserted}
     */
    INSERT_NR_OF_PEOPLE = `INSERT INTO ${config.PEOPLE_FLOW} (ROOM,NR_OF_PEOPLE) VALUES (?,?)`;


    /**
     * Used to extract data from the database
     * and to return it in JSON format
     *
     * @param query A query to select data from the database
     * @returns Data in JSON format
     */
    async extractData(query){

        return JSON.parse(JSON.stringify( await (new dbCon).queryDatabase(query)));
     }


    /**
     * Get from the database all the needed data:
     * | Unproccessed data | Distinct macs | information about nodes | known MACs|
     *
     * @returns {Promise<void>}
     */
    async collectData(){

         this.unprocessedData   =  await this.extractData(this.GET_UNPROCCESED_DATA);
         this.distinctMAC       =  await this.extractData(this.GET_DISTINCT_MACS);
         this.nodesInformations =  await this.extractData(this.GET_NODE_INFORMATIONS);
         this.knownMAC          =  await this.extractData(this.GET_KNOW_MAC);

     }


    /**
     * Proccess data.It call the collectData() to get
     * all the needed data and proccess it using formatData()
     * and estimate the nr of people in each room by calling
     * estimateNrOfPeople()
     *
     * @returns {Promise<{LAST_ACTIVE: *[], USER: *[], ROOM: *[], RSSI_AVERAGE: *[], SSID: *[], MAC: *[]}>}
     */
    async processData(){
        await this.collectData();
        this.processedData = await this.formatData(this.unprocessedData,this.nodesInformations,this.distinctMAC,this.knownMAC);
        this.insertProccessedData(this.processedData)

        this.numberOfPeople = await this.estimateNrOfPeople(this.processedData,this.nodesInformations);
        this.insertNumberOfPeople(this.numberOfPeople)
        return this.processedData;
    }


    /**
     * Estimate the nr of people in each existing location.
     * The location is given by the node locations.
     *
     * @param proccesedData: A JSON object that contains proccessed data
     * @param nodesInformations: A JSON object that contains information about nodes
     * @returns The nrOfPeople with the following format:
     *           |LOCATION | NR_NR_OF_PEOPLE | TIME |
     */
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

    /**
     * Return an array with all locations and
     * with the number of people on each room but
     * default is 0.It basically return a template.
     *
     * @param nodesInformations:A JSON object that contains information about nodes
     * @returns Template for number of people in each room
     */
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

    /**
     * Insert the proccessed data into the database
     *
     * @param processedData: A JSON object that contains proccessed data
     * @returns {Promise<void>}
     */
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

    /**
     * Insert the numberOfPeople into the database
     *
     * @param numberOfPeople: A JSON object that contains information about nodes
     * @returns {Promise<void>}
     */
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

    /**
     * Clear the records from the unproccesedData that
     * contains the same macs as nodeInformations which
     * are the macs of the nodes.
     *
     * @param unproccesedData:A JSON object that contains unproccessed data
     * @param nodeInformations:A JSON object that contains information about nodes
     * @returns Filtered data
     */
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

    /**
     * Format the unproccesed data so,the formated data
     * have just unique MACs with an average RSSI ,
     * with the connected SSID , locationa ,person name
     * and the last time active.The returned data will have
     * the following foramt:
     * |PERSON NAME | LOCATION | MAC | RSSI | SSID | LAST ACTIVE |
     *
     * @param unproccesedData : A JSON object that contains unproccessed data
     * @param nodeInformations :A JSON object that contains information about nodes
     * @param distinctMAC: A JSON object that contains al distinct macs
     * @param knownMAC: A JSON object that contains all known macs
     * @returns {Promise<[]>}
     */
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

    /**
     * Get the location based on node name
     *
     * @param nodeName: Name of the node
     * @param nodeInformations: A JSON object that contains information about nodes
     * @returns Location{string}
     */
    getLocation(nodeName,nodeInformations){
        let location = ""
        nodeInformations.forEach(element => ((element.NODE_NAME === nodeName) && location === "") ? location=element.LOCATION : false);
        return location;
    }

    /**
     * Get the person name  based on the MAC address
     *
     * @param mac: target mac
     * @param knownMAC: A JSON object that contains all known macs
     * @returns PersonName{string}
     */
    getPersonName(mac,knownMAC){
        let personName = "Unknown";
        knownMAC.forEach(elemement => ((elemement.MAC === mac) && personName === "Unknown") ? personName = elemement.PERSON_NAME : false);
        return personName;
    }

}

let t = (new processData());
t.processData();