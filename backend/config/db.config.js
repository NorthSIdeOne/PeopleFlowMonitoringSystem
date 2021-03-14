/**
 * This file is used to connect to the mysql database.
 * @dbCon the mysql object which is used to create a connection
 *        and to connect to the databse.
 */

'use strict';
const config = require('./configurationFile');
const mysql = require('mysql');
const util = require("util");


/**
 *This class is used to connect to the database and
 * make querys.In future can have more methods add.
 *
 * @type {DataBaseClass} Class for database query and
 * for database connection.
 */

let mysqlDB = class DataBaseClass{


    /**
     * Query for creating the database.
     *
     * @CREATE_DATABASE {string}
     */
    CREATE_DATABASE                = `CREATE DATABASE IF NOT EXISTS ${config.DATABASE}`;

    /**
     * Query for creating the the table
     * to store collected data from nodes.
     *
     * @CREATE_COLLECTED_DATA_SNIFFERS {string}
     */
    CREATE_COLLECTED_DATA_SNIFFERS = `CREATE TABLE IF NOT EXISTS ${config.COLLECTED_DATA_SNIFFERS}(
                                         MAC VARCHAR(255) NOT NULL ,RSSI INT(10) NOT NULL, CH INT(10) ,
                                         SSID VARCHAR(255) NOT NULL , NODE_NAME VARCHAR(255) NOT NULL , 
                                         TIME TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )`;

    /**
     * Query for creating the the table
     * to store data about nodes:
     * | Node name | MAC of the node | Location of the node | Last time active |.
     *
     * @CREATE_NODES_INFORMATIONS {string}
     */
    CREATE_NODES_INFORMATIONS      = `CREATE TABLE IF NOT EXISTS ${config.NODES_INFORMATIONS}(
                                        NODE_NAME VARCHAR(255) NOT NULL , MAC VARCHAR(255) NOT NULL ,
                                        LOCATION VARCHAR(255) NOT NULL , ACTIVE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )`;
    /**
     * Query for creating the the table
     * to store known macs and associated names.
     *
     * @CREATE_KNOWN_MACS {string}
     */
    CREATE_KNOWN_MACS              = `CREATE TABLE IF NOT EXISTS ${config.KNOWN_MAC}(
                                        MAC VARCHAR(255) NOT NULL ,PERSON_NAME VARCHAR(255) NOT NULL)`;

    /**
     * Query for creating the the table
     * to store processed data from the algorithm.
     *
     * @CREATE_PROCESSED_DATA {string}
     */
    CREATE_PROCESSED_DATA          = `CREATE TABLE IF NOT EXISTS ${config.PROCESSED_DATA}(
                                         PERSON_NAME VARCHAR(255) NOT NULL, LOCATION VARCHAR(255) NOT NULL,
                                         MAC VARCHAR(255) NOT NULL ,RSSI INT(10) NOT NULL,
                                         SSID VARCHAR(255) NOT NULL, 
                                         LAST_ACTIVE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`;
    /**
     * Query for creating the the table
     * to store data about how many people
     * are in a location(room).
     *
     * @CREATE_PEOPLE_FLOW {string}
     */
    CREATE_PEOPLE_FLOW             = `CREATE TABLE IF NOT EXISTS ${config.PEOPLE_FLOW}(
                                        ROOM VARCHAR(255) NOT NULL ,NR_OF_PEOPLE INT(10) NOT NULL,
                                        TIME TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`;
    /**
     * Query for creating the the table
     * to store node configuration.
     *
     * @CREATE_NODES_CONFIGURATION {string}
     */
    CREATE_NODES_CONFIGURATION     = `CREATE TABLE IF NOT EXISTS ${config.NODES_CONFIGURATION}(
                                        NODE VARCHAR(255) NOT NULL ,SNIFFING_TIME INT(10) NOT NULL,
                                        CHANNEL_HOPPING INT(255) NOT NULL)`;



    /**
     *This function is used to return a query function
     * where a connection to the database is made then a
     * function is returned with the connection.The returned
     * function takes a query as a parametr and returns a promise.
     *
     * @returns a query function that return a promise.
     */
    queryDataBase(){
        const dbCon = mysql.createConnection({

            host:     config.HOST,
            user:     config.USER,
            password: config.PASSWORD,
            database: config.DATABASE

        });
        return {
            query( query, args ) {
                return util.promisify( dbCon.query )
                    .call( dbCon, query, args );
            },
            close() {
                return util.promisify( dbCon.end ).call( dbCon );
            }
        };
    }

    /**
     * Function used to return a query with a connection
     * to with the server that can be used to create a database.
     *
     * @returns a query function that return a promise.
     */
    queryOnServer(){
        const dbCon = mysql.createConnection({

            host:     config.HOST,
            user:     config.USER,
            password: config.PASSWORD,
        });

        return {
            query( query, args ) {
                return util.promisify( dbCon.query )
                    .call( dbCon, query, args );
            },
            close() {
                return util.promisify( dbCon.end ).call( dbCon );
            }
        };

    }

    /**
     * Used to create the database asynchronous and close connection after
     * it creates the database.
     *
     * @param query: String that contains the query to create the database
     */
     async creatDataBase(query)
    {
        let dbQuery = this.queryOnServer();
        await dbQuery
            .query(this.CREATE_DATABASE)
            .then(dbQuery.close)
            .then(console.log("Connected to the " + config.DATABASE + "!"));

    }

    /**
     * Used to create tables in the database
     *
     * @param query
     * @param tableName
     */
   async createTables(query,tableName) {
        let queryDB = this.queryDataBase();
        await queryDB
            .query(query)
            .then(queryDB.close())
            .then(console.log(tableName + " table was created successfully"));
    }


    /**
     * Used to call the functions that create the database
     * and all the tables.
     *
     * @returns void
     */
    async init(){
        try{
            await this.creatDataBase(this.CREATE_DATABASE);
            await this.createTables(this.CREATE_COLLECTED_DATA_SNIFFERS,config.COLLECTED_DATA_SNIFFERS);
            await this.createTables(this.CREATE_NODES_INFORMATIONS,config.NODES_INFORMATIONS);
            await this.createTables(this.CREATE_KNOWN_MACS,config.KNOWN_MAC);
            await this.createTables(this.CREATE_PEOPLE_FLOW,config.PEOPLE_FLOW);
            await this.createTables(this.CREATE_PROCESSED_DATA,config.PROCESSED_DATA);
            await this.createTables(this.CREATE_NODES_CONFIGURATION,config.NODES_CONFIGURATION);
        }
        catch (err){
            console.log(err.message);
        }

    }

}

  let db = (new mysqlDB()).init();

  module.exports=mysqlDB;