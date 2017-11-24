var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var cityhallQry = require("../../repository/queries/cityhall");
var stringExt = require("../../utils/stringExt");
var infoConstants = require("../../model/constants/infoConstants");

var topSectionController = {};

topSectionController.init = function (app, router) {
    
    router.get('/topSection', function (req, res) {
        var id = 105;
        
        if (req.query !== undefined && req.query.id !== undefined)
            id = req.query.id;
        
        var years = [{ key: 2006, value: '2006' },
            { key: 2009, value: '2009' },
            { key: 2012, value: '2012' },
            { key: 2015, value: '2015' }];
        
        var candidates = [
            { key: 'PRI', value: 'PRI' },
            { key: 'PAN', value: 'PAN' },
            { key: 'PT', value: 'PT' },
            { key: 'PRD', value: 'PRD' },
            { key: 'Morena', value: 'Morena' },
            { key: 'LN', value: 'Listado nominal' },
            { key: 'NULOS', value: 'Nulos' },
            { key: 'ABSTENCION', value: 'Abstenciones' },
            { key: 'TOTAL', value: 'Total' }];
        var searchType = [{ key: 1, value: 'Mayor votación' }, { key: 2, value: 'Menor votación' }];
        var topN = [{ key: 10, value: 'Top 10' }, { key: 20, value: 'Top 20' }, { key: 30, value: 'Top 30' }];
        
        years = JSON.stringify(years);
        candidates = JSON.stringify(candidates);
        searchType = JSON.stringify(searchType);
        topN = JSON.stringify(topN);

        res.render('cityhall/topSection', {years: years, candidates: candidates, searchType: searchType, topN: topN, id: id});
    });

    router.post('/topSectionData', function(req, res) {
        try {
            var rVal = req.body;
            var iYear = parseInt(rVal.year.key);
            var idMun = 105;
            if (rVal.id !== undefined)
                idMun = rVal.id;
            var siglas = rVal.candidate.key.toUpperCase();
            var searchType = rVal.searchType.key === 1 ? 'DESC' : 'ASC';
            var topN = parseInt(rVal.topN.key);
            var connection = mysql.createConnection(connectionInfo);
            
            switch (siglas) {
                case "LN":    
                case "NULOS":
                case "ABSTENCION":
                case "TOTAL":
                    {
                        siglas = siglas.toLowerCase();
                        var extraInfo;
                        for (var i = 0, len = infoConstants.extraColumns.length; i < len; i++) {
                            var exInf = infoConstants.extraColumns[i];
                            if (exInf.key === siglas) {
                                extraInfo = exInf;
                                break;
                            }
                        }

                        if (extraInfo === undefined) {
                            res.json({ success: false, msg: 'Siglas no encontradas: '  + siglas });
                            return;
                        }

                        var qryEleAyuntSeccI = stringExt.format(cityhallQry.qryEleAyuntSecc, extraInfo.field, iYear, idMun, extraInfo.field, searchType, topN);
                        connection.query(qryEleAyuntSeccI, function (errA, rowsA) {
                            if (errA) {
                                connection.end();
                                res.json({ success: false, msg: errA });
                                return;
                            }
                            
                            res.json({ success: true, rows: rowsA, color: extraInfo.color, siglas: extraInfo.value });
                        });
                        break;
                    }
                default:
                    {
                        var qrySelFieldCandidate = stringExt.format(cityhallQry.qrySelFieldCandidate, siglas, iYear);
                        
                        connection.query(qrySelFieldCandidate, function (err, rows) {
                            if (err) {
                                connection.end();
                                res.json({ success: false, msg: err });
                                return;
                            }
                            
                            var row = rows[0];
                            var qryEleAyuntSecc = stringExt.format(cityhallQry.qryEleAyuntSecc, row.campo, iYear, idMun, row.campo, searchType, topN);
                            connection.query(qryEleAyuntSecc, function (errA, rowsA) {
                                if (errA) {
                                    connection.end();
                                    res.json({ success: false, msg: errA });
                                    return;
                                }
                                
                                res.json({ success: true, rows: rowsA, color: row.color, siglas: row.siglas });
                            });
                        });
                        break;
                    }
            }

        } catch(e) {
            res.json({ success: false, msg: e });
            return;
        } 
    });
};
module.exports = topSectionController;
