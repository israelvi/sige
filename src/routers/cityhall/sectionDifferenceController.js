var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var cityhallQry = require("../../repository/queries/cityhall");
var stringExt = require("../../utils/stringExt");
var infoConstants = require("../../model/constants/infoConstants");

var sectionDifferenceController = {};

sectionDifferenceController.init = function (app, router) {
    
    router.get('/sectionDifference', function(req, res) {
        var id = 105;
        
        if (req.query !== undefined && req.query.id !== undefined)
            id = req.query.id;

        var searchType = [{ key: 1, value: 'Mayor votación' }, { key: 2, value: 'Menor votación' }];
        var topN = [{ key: 10, value: 'Top 10' }, { key: 20, value: 'Top 20' }, { key: 30, value: 'Top 30' }];

        var connection = mysql.createConnection(connectionInfo);
        connection.query(cityhallQry.qryAllCandidatos, function (err, rows) {
            if (err) {
                connection.end();
                res.json({ success: false, msg: err });
                return;
            }
            res.render('cityhall/sectionDifference', {
                rows: JSON.stringify(rows), topN: JSON.stringify(topN), id: id, 
                searchType: JSON.stringify(searchType),
                extraColumns: JSON.stringify(infoConstants.extraColumns)
            });
        });

    });

    router.post('/sectionDifferenceData', function(req, res) {
        try {
            var rVal = req.body;
            var iYear = parseInt(rVal.year.key);
            var idMun = 105;
            if (rVal.id !== undefined)
                idMun = rVal.id;
            var candidateField = rVal.candidate.field;
            var searchType = rVal.searchType.key === 1 ? 'DESC' : 'ASC';
            var topN = parseInt(rVal.topN.key);
            var connection = mysql.createConnection(connectionInfo);
            
            var qrySecDiff = stringExt.format(cityhallQry.qrySecDiff, iYear, idMun, candidateField, searchType, topN);
            
            connection.query(qrySecDiff, function (err, rows) {
                if (err) {
                    connection.end();
                    res.json({ success: false, msg: err });
                    return;
                }
                res.json({ success: true, rows: rows });
            });

        } catch(e) {
            res.json({ success: false, msg: e });
            return;
        } 
    });
};
module.exports = sectionDifferenceController;
