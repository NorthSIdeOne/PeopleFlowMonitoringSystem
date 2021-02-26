/**
 * This file is used to connect to the mysql database.
 * @dbCon the mysql object which is used to create a connection
 *        and to connect to the databse.
 */

'use strict';
const config = require('./configurationFile');
const mysql = require('mysql');

const dbCon = mysql.createConnection({

    host:     config.HOST,
    user:     config.USER,
    password: config.PASSWORD,
    database: config.DATABSE

});

/**
 *  Connect to the database.If the databse is not runnig
 * an error will be displayed.If is working a message will
 * be displayed.
 */
dbCon.connect(function(err) {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
    }
    console.log('Connected as id ' + dbCon.threadId);
  });

  module.exports=dbCon;