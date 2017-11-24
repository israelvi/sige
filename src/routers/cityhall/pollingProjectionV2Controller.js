var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var stringExt = require("../../utils/stringExt");
var infoConstants = require("../../model/constants/infoConstants");
var cityhallQry = require("../../repository/queries/cityhall");
var async = require("async");

var pollingProjectionV2Controller = {};

pollingProjectionV2Controller.init = function (app, router) {
    
    router.get('/pollingProjectionV2', function (req, res) {
        
        var connection = mysql.createConnection(connectionInfo);
        var idMun = 105, year = 2012;
        if (req.query !== undefined && req.query.id !== undefined)
            idMun = req.query.id;
        
        var qrySelProjectionParams = stringExt.format(cityhallQry.qrySelProjectionParams, idMun, 2);
        
        connection.query(qrySelProjectionParams, function (err, rows) {
            if (err) {
                connection.end();
                res.render('cityhall/pollingProjectionV2', { success: false, msg: err, rows: JSON.stringify([]) });
                return;
            }

            var qry = stringExt.format(cityhallQry.qryProjectionByPolling, year, idMun);
            connection.query(qry, function(errI, rowsI) {
                if (errI) {
                    connection.end();
                    res.render('cityhall/pollingProjectionV2', { success: false, msg: err, rows: JSON.stringify([]) });
                    return;
                }
            
                res.render('cityhall/pollingProjectionV2', { success: true, rows: JSON.stringify(rows), resElec: JSON.stringify(rowsI)});
            });

        });        
    });
    
};
module.exports = pollingProjectionV2Controller;
