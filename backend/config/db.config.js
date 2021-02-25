'use strict';

const mysql = require('mysql');

const dbCon = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "sniffer_test"

});

dbCon.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  });

  module.exports=dbCon;