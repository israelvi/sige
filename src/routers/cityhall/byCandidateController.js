var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var cthallQry = require("../../repository/queries/cityhall");
var infoConstants = require("../../model/constants/infoConstants");
var stringExt = require("../../utils/stringExt");
var async = require("async");

var byCandidateController = {};

byCandidateController.init = function (app, router) {    
    
    router.get('/byCandidate', function (req, res) {
        
        var id = 105;
        
        if (req.query !== undefined && req.query.id !== undefined)
            id = req.query.id;

        var connection = mysql.createConnection(connectionInfo);
        
        var queryElec = function (qryEach, callback) {
            connection.query(qryEach, function (errIn, rowsIn, fieldsIn) {
                if (errIn)
                    callback(errIn);
                else
                    callback(null, rowsIn);
            });
        };

        var partidos = [{ color: "#F6111B", name: 'PRI' }, { color: "#00468E", name: 'PAN' }, { color: "#FFD90A", name: 'PRD' }, { color: "#B5261E", name: 'Morena' }];

        connection.query(cthallQry.qryCandidatos, function (err, rows, fields) {
            if (err) {
                connection.end();
                res.render('error', {
                    message: err
                });
                return;
            }
            
            var dtAyuntamiento = {}, i, len, bFound;
            for (i = 0, len = rows.length; i < len; i++) {
                var row = rows[i];
                if (dtAyuntamiento[row.anio] === undefined)
                    dtAyuntamiento[row.anio] = [];
                
                //Looking for same candidate and merge if exists
                var dtAn = dtAyuntamiento[row.anio];
                bFound = false;
                for (var h = 0, lenH = dtAn.length; h < lenH; h++) {
                    var candidate = dtAn[h];
                    if (candidate.idCandidato === row.idCandidato) {
                        candidate.siglasReal = candidate.siglasReal + "-" + row.siglasReal;
                        candidate.siglasName = (row.anio === 2009 || row.anio === 2015 ? candidate.siglasReal : candidate.siglas);
                        bFound = true;
                    }
                }

                if (bFound === false) {
                    dtAyuntamiento[row.anio].push({
                        idCandidato: row.idCandidato, campo: row.campo, 
                        siglas: row.siglas, siglasReal: row.siglasReal, siglasName: row.siglasReal, color: row.color
                    });
                }
            }
            
            var lstQuerys = [];
            
            for (var key in dtAyuntamiento) {
                var lstInfo = dtAyuntamiento[key];
                var query = "";
                
                for (i = 0, len = lstInfo.length; i < len; i++) {
                    var info = lstInfo[i];
                    if (query === "") {
                        query = "SUM(eas." + info.campo + ") AS " + info.campo;
                    } else {
                        query = query + ", " + "SUM(eas." + info.campo + ")  AS " + info.campo;
                    }
                }
                
                var qryIn = stringExt.format(cthallQry.qryElecAyunt,  query, key, id);
                dtAyuntamiento[key].query = qryIn;
                lstQuerys.push(qryIn);
            }
            
            async.map(lstQuerys, queryElec, function (asyErr, results) {
                connection.end();

                if (asyErr) {
                    res.render('error', {
                        message: asyErr
                    });
                    return;
                }

                var series = [];
                for (i = 0, len = partidos.length; i < len; i++) {
                    var partido = partidos[i];
                    series.push({
                        data: [],
                        color: partido.color,
                        name: partido.name,
                        stack: i
                    });
                }
                
                

                var categories = [];
                for (i = 0, len = results.length; i < len; i++) {
                    var rowsRes = results[i];
                    for (var j = 0, lenI = rowsRes.length; j < lenI; j++) {
                        var rowRes = rowsRes[j];
                        categories.push(rowRes.anio);
                        for (var k = series.length-1; k >= 0; k--) {
                            var serie = series[k];
                            for (var m = 0, lenM = dtAyuntamiento[rowRes.anio].length; m < lenM; m++) {
                                var dtInfo = dtAyuntamiento[rowRes.anio][m];

                                if (dtInfo.siglas !== serie.name)
                                    continue;

                                if (dtInfo.siglas === serie.name && dtInfo.siglasName === serie.name) {
                                    
                                    for (var pp = serie.data.length; pp < i; pp++) {
                                        serie.data.push(null);
                                    }

                                    serie.data.push(rowRes[dtInfo.campo]);
                                    serie.color = dtInfo.color;
                                    continue;
                                }

                                var inData = [];
                                for (var p = 0; p < i; p++) {
                                    inData.push(null);
                                }
                                inData.push(rowRes[dtInfo.campo]);
                                    
                                series.push({
                                    data: inData,
                                    name: dtInfo.siglasReal,
                                    stack: serie.stack,
                                    color: dtInfo.color
                                });
                            }
                        }
                    }
                }

                series = JSON.stringify(series);
                results = JSON.stringify(results);
                
                res.render('cityhall/byCandidate', {
                    categories: categories, series: series, results: results, 
                    extSeries: JSON.stringify(infoConstants.extraColumns)
                });
            });

        });
    });
};
module.exports = byCandidateController;
