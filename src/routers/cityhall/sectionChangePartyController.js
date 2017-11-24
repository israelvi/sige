var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var cityhallQry = require("../../repository/queries/cityhall");
var stringExt = require("../../utils/stringExt");
var infoConstants = require("../../model/constants/infoConstants");

var sectionChangePartyController = {};

sectionChangePartyController.init = function (app, router) {
    
    router.get('/sectionChangeParty', function (req, res) {
        var id = 105;
        if (req.query !== undefined && req.query.id !== undefined)
            id = req.query.id;
        var parties = [{ value: 'PRI', key:1 }, { value: 'PAN', key:2 }, { value: 'PRD', key:3 }];
        parties = JSON.stringify(parties);
        var sectionType = [{ value: 'SI', key: 0 }, { value: 'NO', key: 1 }];
        sectionType = JSON.stringify(sectionType);
        var topN = [{ value: 'Top 10', key: 10 }, { value: 'Top 20', key: 20 }, { value: 'Top 30', key: 30 }];
        topN = JSON.stringify(topN);        
        res.render('cityhall/sectionChangeParty', {parties: parties, sectionType: sectionType, topN:topN, id:id});
    });

    router.post('/sectionChangePartyData', function (req, res) {
        try {
            var rVal = req.body;
            var idMun = 105;
            if (rVal.id !== undefined)
                idMun = rVal.id;
            var iParty = parseInt(rVal.party.key);
            var sectionType = rVal.sectionType.key;
            var topN = parseInt(rVal.topN.key);
            
            var connection = mysql.createConnection(connectionInfo);
            
            var qrySelElecDiffEqSec = stringExt.format(cityhallQry.qrySelElecDiffEqSec, idMun, iParty, sectionType, topN);
            
            connection.query(qrySelElecDiffEqSec, function (err, rows) {
                if (err) {
                    connection.end();
                    res.json({ success: false, msg: err });
                    return;
                }
                res.json({ success: true, rows: rows });
            });

        } catch (e) {
            res.json({ success: false, msg: e });
            return;
        }    
    });
    
    router.post('/sectionSearchByTypeAhead', function (req, res) {
        var rVal = req.body;
        var idMun = 105;
        if (rVal.params !== undefined && rVal.params.id !== undefined)
            idMun = rVal.params.id;
        var connection = mysql.createConnection(connectionInfo);
        var qrySecSearchBy = stringExt.format(cityhallQry.qrySecSearchBy, idMun, rVal.params.field);
        
        connection.query(qrySecSearchBy, function (err, rows) {
            if (err) {
                connection.end();
                res.json({ success: false, msg: err });
                return;
            }
            res.json({ success: true, rows: rows });
        });
    });
    
    router.post('/locationSearchByTypeAhead', function (req, res) {
        var rVal = req.body;
        var idMun = 105;
        if (rVal.params !== undefined && rVal.params.id !== undefined)
            idMun = rVal.params.id;
        var connection = mysql.createConnection(connectionInfo);
        var qryColSearchBy = stringExt.format(cityhallQry.qryColSearchBy, idMun, rVal.params.field);
        
        connection.query(qryColSearchBy, function (err, rows) {
            if (err) {
                connection.end();
                res.json({ success: false, msg: err });
                return;
            }
            res.json({ success: true, rows: rows });
        });
    });
    
    router.post('/sectionChangePartyAddSection', function (req, res) {
        try {
            var rVal = req.body;
            var section = parseInt(rVal.value);
            var idMun = 105;
            if (rVal.id !== undefined)
                idMun = rVal.id;
            
            var connection = mysql.createConnection(connectionInfo);
            var qryAddBySec = stringExt.format(cityhallQry.qryAddBySec, idMun, section);
            
            connection.query(qryAddBySec, function (err, rows) {
                if (err) {
                    connection.end();
                    res.json({ success: false, msg: err });
                    return;
                }
                res.json({ success: true, rows: rows });
            });

        } catch (e) {
            res.json({ success: false, msg: e });
            return;
        }
    });
    
    router.post('/sectionChangePartyAddLocation', function (req, res) {
        try {
            var rVal = req.body;
            var location = rVal.value;
            var idMun = 105;
            if (rVal.id !== undefined)
                idMun = rVal.id; 
            var connection = mysql.createConnection(connectionInfo);
            var qryAddByLoc = stringExt.format(cityhallQry.qryAddByLoc, idMun, location);
            
            connection.query(qryAddByLoc, function (err, rows) {
                if (err) {
                    connection.end();
                    res.json({ success: false, msg: err });
                    return;
                }
                res.json({ success: true, rows: rows });
            });

        } catch (e) {
            res.json({ success: false, msg: e });
            return;
        }
    });

};

module.exports = sectionChangePartyController;
