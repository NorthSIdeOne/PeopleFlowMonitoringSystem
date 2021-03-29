'use strict';
const node = require('../models/Node.model');

/**
 * Upload data recived from the node
 * into the database
 *
 * @param req: Request parameter
 * @param res: Response parameter
 */
exports.uploadData = function(req, res) {

    const nodeObj = new node();
    nodeObj.uploadData(req,res);

};

/**
 * Get all the data from the database.
 * Unproccessed data collected from all nodes.
 *
 * @param req: Request parameter
 * @param res: Response parameter
 *
 * @returns Return all data nodes data from the DB
 */
exports.getDeviceData=async function(req,res){

    return (await (new node()).getData())
    
}

