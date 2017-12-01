var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var stringExt = require("../../utils/stringExt");
var infoConstants = require("../../model/constants/infoConstants");
var cthallQry = require("../../repository/queries/cityhall");
var async = require("async");

var electionCoverageController = {};

electionCoverageController.init = function (app, router) {
    
    router.get('/electionCoverage', function (req, res) {
        var id = 105;
        var coverage = [];
        
        if (req.query !== undefined && req.query.id !== undefined)
            id = req.query.id;
        
        var connection = mysql.createConnection(connectionInfo);
        
        var qryIn = stringExt.format(cthallQry.qryCoverages, id);
        
        connection.query(qryIn, function (err, rows) {
            if (err) {
                connection.end();
                res.json({ success: false, msg: err });
                return;
            }
            
            coverage.push('OK');
            res.render('cityhall/electionCoverage', {
                secCoverage: JSON.stringify(rows),
                idMun: id
            });
        });


    });
    
    router.post('/electionCoverageSave', function (req, res) {
        var connection = mysql.createConnection(connectionInfo);
        var arrParams = [req.body.id, req.body.sections, new Date()];
        
        var sql = "INSERT INTO cobertura (IdMunicipio, Cobertura, InsFechaHora) VALUES(?, ?, ?);";
        
        var log = connection.query(sql, arrParams, function (err, results) {
            if (err) {
                res.json({ hasError: true, msg: 'No fue posible guardar la información debido a: ' + err });
                return;
            }
            
            res.json({ hasError: false, msg: 'Información almacenada de forma correcta' });
        });
        
        console.log(log);
    });
};
module.exports = electionCoverageController;
