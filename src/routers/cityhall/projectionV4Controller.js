var mysql = require('mysql');
var connectionInfo = require("../../repository/connectionDb");
var stringExt = require("../../utils/stringExt");
var infoConstants = require("../../model/constants/infoConstants");
var cthallQry = require("../../repository/queries/cityhall");
var async = require("async");

var projectionV4Controller = {};

projectionV4Controller.init = function (app, router) {
    
    router.get('/projectionV4', function (req, res) {
        
        var id = 105;
        
        if (req.query !== undefined && req.query.id !== undefined)
            id = req.query.id;
        
        var parties = [{ value: 'PRI', key: 1 }, { value: 'PAN', key: 2 }, { value: 'PRD', key: 3 }, { value: 'Morena', key: 11 }];
        parties = JSON.stringify(parties);
        
        var connection = mysql.createConnection(connectionInfo);
        
        var queryElec = function (qryEach, callback) {
            connection.query(qryEach, function (errIn, rowsIn) {
                if (errIn)
                    callback(errIn);
                else
                    callback(null, rowsIn);
            });
        };
        
        var partidos = [{ color: "#FF0000", name: 'PRI' }, { color: "#0000FF", name: 'PAN' }, { color: "#FFFF00", name: 'PRD' }, { color: "#B5261E", name: 'Morena' }];
        
        connection.query(cthallQry.qryCandidatos, function (err, rows) {
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
                
                var qryIn = stringExt.format(cthallQry.qryElecAyunt, query, key, id);
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
                        for (var k = series.length - 1; k >= 0; k--) {
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

                categories.push('2018');

                series = JSON.stringify(series);
                results = JSON.stringify(results);
                
                res.render('cityhall/projectionV4', {
                    categories: categories, series: series, results: results, 
                    extSeries: JSON.stringify(infoConstants.extraColumns), parties: parties,
                    idMun: id
                });
            });

        });
    });

    router.post('/projectionSaveV4', function (req, res) {
        var connection = mysql.createConnection(connectionInfo);
        var idMun = req.body.idMun;
        var param = JSON.stringify(req.body.params);
        var siglas = req.body.params.serieWinner.siglas;
        var keyParam = infoConstants.SaveProjMun + "_" + siglas;
        //var jsonParams = { IdMunicipio: idMun, KeyParam: keyParam, ValueParam: param};
        var arrParams = [idMun, keyParam, 4, param, param];

        var sql = "INSERT INTO projectionparams (IdMunicipio, KeyParam, ProjectionType, ValueParam) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE ValueParam = ?;";

        var log = connection.query(sql, arrParams, function(err, results) {
            if (err) {
                res.json({ success: false, msg: 'No fue posible guardar la información debido a: ' + err });
                return;
            }
            
            res.json({ success: true, msg: 'Información almacenada de forma correcta' });
        });

        console.log(log);
    });
};
module.exports = projectionV4Controller;
