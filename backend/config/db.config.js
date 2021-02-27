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

}

  module.exports=mysqlDB;