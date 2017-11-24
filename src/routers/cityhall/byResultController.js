var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var cthallQry = require("../../repository/queries/cityhall");
var stringExt = require("../../utils/stringExt");
var infoConstants = require("../../model/constants/infoConstants");
var async = require("async");

var byResultController = {};

byResultController.init = function (app, router) {    

    router.get('/index', function (req, res) {
        res.render('cityhall/index', {});
    });
    
    
    router.get('/byResults', function (req, res) {
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

        var partidos = [{ name: 'PRI' }, { name: 'PAN' }, { name: 'PRD' }, { name: 'Morena' }];

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
                console.log(row.anio);
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
                    dtAyuntamiento[row.anio].push({ idCandidato: row.idCandidato, campo: row.campo, siglas: row.siglas, siglasReal: row.siglasReal, color: row.color });
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
                        type: 'column',
                        data: [],
                        name: partido.name
                    });
                }

                var categories = [];
                for (i = 0, len = results.length; i < len; i++) {
                    var rowsRes = results[i];
                    for (var j = 0, lenI = rowsRes.length; j < lenI; j++) {
                        var rowRes = rowsRes[j];
                        categories.push(rowRes.anio);
                        for (var k = 0, lenK = series.length; k < lenK; k++) {
                            var serie = series[k];
                            var votaciones = 0, color="", siglas = "";
                            for (var m = 0, lenM = dtAyuntamiento[rowRes.anio].length; m < lenM; m++) {
                                var dtInfo = dtAyuntamiento[rowRes.anio][m];
                                if (dtInfo.siglas !== serie.name)
                                    continue;
                                else if (color === "") {
                                    color = dtInfo.color;
                                }
                                if (siglas.length < dtInfo.siglasReal.length) {
                                    siglas = dtInfo.siglasReal;
                                }
                                
                                votaciones += rowRes[dtInfo.campo];
                            }
                            
                            if (serie.siglas === undefined)
                                serie.siglas = {};
                            
                            serie.siglas[rowRes.anio] = siglas;
                            serie.color = color;
                            serie.data.push(votaciones);
                        }
                    }
                }

                series = JSON.stringify(series);
                results = JSON.stringify(results);
                
                res.render('cityhall/byResult', {
                    categories: categories, series: series, results: results, 
                    extSeries: JSON.stringify(infoConstants.extraColumns)
                });
            });

        });
    });
};
module.exports = byResultController;
