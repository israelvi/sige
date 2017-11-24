app.controller('projectionController', function ($scope, $http, $timeout) {
    
    $scope.serieWinner = undefined;
    
    $scope.initialize = function () {
        
        var res = $scope.infoSeries;
        var percLn = 0, percTot = 0, lnIni = res[0][0].ln, totIni = res[0][0].total;
        
        
        for (var i = 1, len = res.length; i < len; i++) {
            var r2 = res[i][0];
            var parc = (r2.ln * 100) / lnIni;
            percLn += parc;
            console.log(parc);
            
            parc = (r2.total * 100) / totIni;
            percTot += parc;
            console.log(parc);
            
            if (i === res.length - 1) {
                $scope.lnLast = r2.ln;
                $scope.vtLast = r2.total;
            }

        }
        
        percLn = percLn / (i - 1);
        console.log(percLn);
        percTot = percTot / (i - 1);
        console.log(percTot);
        
        $scope.lnIni = lnIni;
        $scope.totIni = totIni;
        $scope.lnCurr = parseInt(lnIni * (percLn / 100.0));
        $scope.vtCurr = parseInt(totIni * (percTot / 100.0));
        $scope.infoProj = { percLn: percLn, percTot: percTot };
        
        $scope.mergeParties(res);

    };
    
    var getPriElec = function (i, r2) {
        switch (i) {
            case 0:
            case 2:
                return r2.CandidatoB;
            case 1:
                return (r2.CandidatoB + r2.CandidatoF + r2.CandidatoG + r2.CandidatoH + r2.CandidatoI + r2.CandidatoJ);
            case 3:
                return (r2.CandidatoB + r2.CandidatoE + r2.CandidatoG + r2.CandidatoL + r2.CandidatoM + r2.CandidatoN + r2.CandidatoO);
        }
        return 0;
    };
    
    var getPanElec = function (i, r2) {
        switch (i) {
            case 0:
            case 1:
            case 2:
                return r2.CandidatoA;
            case 3:
                return (r2.CandidatoA + r2.CandidatoD + r2.CandidatoP);
        }
        return 0;
    };
    
    var getPrdElec = function (i, r2) {
        switch (i) {
            case 0:
            case 1:
            case 3:
                return r2.CandidatoC;
            case 2:
                return r2.CandidatoD;
        }
        return 0;
    };
    
    var getMorElec = function (i, r2) {
        switch (i) {
            case 3:
                return r2.CandidatoH;
        }
        return 0;
    };
    
    $scope.mergeParties = function (res) {
        var vPri = res[0][0].CandidatoB, vPan = res[0][0].CandidatoA, vPrd = res[0][0].CandidatoC, vMor = vPrd;
        var percPri = 0, percPan = 0, percPrd = 0, percMor = 0, parc, r2;
        $scope.totalSerie = [];
        
        $scope.totalSerie.push(res[0][0].total);
        for (var i = 1, len = res.length; i < len; i++) {
            r2 = res[i][0];
            parc = (getPriElec(i, r2) * 100) / vPri;
            percPri += parc;
            //console.log(parc);
            
            parc = (getPanElec(i, r2) * 100) / vPan;
            percPan += parc;
            //console.log(parc);
            
            parc = (getPrdElec(i, r2) * 100) / vPrd;
            percPrd += parc;
            
            parc = (getMorElec(i, r2) * 100) / vPrd;
            percMor += parc;
            
            $scope.totalSerie.push(r2.total);
            //console.log(parc);
        }
        
        $scope.totalSerie.push($scope.vtCurr);
        
        percPri = percPri / (i - 1);
        percPan = percPan / (i - 1);
        percPrd = percPrd / (i - 1);
        percMor = percMor;
        
        $scope.infoProj['vPRI'] = vPri;// = parseInt(vPri * (percPri / 100.0));
        $scope.infoProj['vPAN'] = vPan;// = parseInt(vPan * (percPan / 100.0));
        $scope.infoProj['vPRD'] = vPrd;// = parseInt(vPrd * (percPrd / 100.0));
        $scope.infoProj['vMorena'] = vMor;// = parseInt(vPrd * (percPrd / 100.0));
        
        //$scope.infoProj['percPri'] = percPri;
        //$scope.infoProj['percPan'] = percPan;
        //$scope.infoProj['percPrd'] = percPrd;
        
        $scope.slPerLn = 50;
        $scope.slPerVt = 50;
        
        $scope.slParties = [parseInt(percPri), parseInt(percPan), parseInt(percPrd), parseInt(percMor)];
        
        window.scProj = $scope;
        
        $timeout(function () {
            $scope.onIniGenerate("#statCityHallProjection");
        }, 200);
    };
    
    $scope.onSlideLnVtChange = function (value) {
        $scope.slPerLn = value;
        $scope.slPerVt = 100 - value;
        $scope.$apply();
    };
    
    
    $scope.onSlideChange = function (value, pos) {
        $scope.slParties[pos] = value;
        $scope.$apply();
    };
    
    $scope.onGenerate = function (chartName) {
        var chart = $(chartName).highcharts();
        
        for (var j = chart.series.length - 1; j >= 0; j--) {
            if (chart.series[j].name === "Proyección")
                chart.series[j].remove();
        }
        
        var series = $scope.dataSeries;
        var data = [], result;
        
        for (var i = 0, len = series.length; i < len; i++) {
            var serie = series[i];
            switch (i) {
                case 0:
                    result = ($scope.infoProj.vPRI * ($scope.slParties[0] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    data.push({
                        name: 'PRI',
                        y: parseInt(result),
                        color: serie.color
                    });
                    break;
                case 1:
                    result = ($scope.infoProj.vPAN * ($scope.slParties[1] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    data.push({
                        name: 'PAN-PRD',
                        y: parseInt(result),
                        color: serie.color
                    });
                    break;
                case 2:
                    result = ($scope.infoProj.vPRD * ($scope.slParties[2] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    data[1].y = parseInt(result + data[1].y);
                    break;
                case 3:
                    result = ($scope.infoProj.vMorena * ($scope.slParties[3] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    data.push({
                        name: 'Morena',
                        y: parseInt(result),
                        color: serie.color
                    });
                    
            }
        }
        
        chart.addSeries({
            type: 'pie',
            name: 'Proyección',
            data: data,
            center: ["75%", "14%"],
            size: 250
        });

    };
    
    //CandidatoB":91454,"CandidatoF":10147,"CandidatoG":3733,"CandidatoH":2173,"CandidatoI":622,"CandidatoJ
    $scope.onIniGenerate = function (chartName) {
        var electionNum = 4;
        var chart = $(chartName).highcharts();
        
        for (var j = chart.series.length - 1; j >= 0; j--) {
            chart.series[j].remove();
        }
        
        var series = $scope.dataSeries, result, res;
        var serieProy = [{ "data": [null, null, null, null], "name": "Proyección", "color": "rgba(250, 21, 33, 0.7)" },
                        { "data": [null, null, null, null], "name": "Proyección", "color": "rgba(4, 74, 147, 0.7)" },
                        { "data": [null, null, null, null], "name": "PRD", "color": "rgba(255, 222, 17, 0.7)" },
                        { "data": [null, null, null, null], "name": "Votos requeridos", "color": "#FA1521", stack: 3 },
                        {
                type: 'spline',
                name: 'Participación',
                yAxis: 1,
                data: $scope.totalSerie,
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0],
                    fillColor: 'white'
                }
            }];
        
        var serieWinner = { "data": [null, null, null, null], "name": "Morena", stack : 2, siglas: $scope.party.value };
        
        var max = 0, valWin;
        for (var i = 0, len = series.length; i < len; i++) {
            var serie = series[i];
            serie.data.splice(electionNum);
            switch (i) {
                case 0:
                    result = ($scope.infoProj.vPRI * ($scope.slParties[0] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    if (result > max)
                        max = result;
                    
                    //if ($scope.party.value === 'PRI')
                    //    valWin = result;
                    
                    if ($scope.opt.key === 0) {
                        serie.data.push(serie.data[electionNum - 1]);
                        res = result - serie.data[electionNum - 1];
                        serieProy[0].data.push((res > 0 ? parseInt(res) : parseInt(res)));
                        serieProy[0].stack = 0;
                        chart.addSeries(serieProy[0], false);
                    } 
                    else {
                        serie.data.push(parseInt(result));
                    }
                    
                    break;
                case 1:
                    result = ($scope.infoProj.vPAN * ($scope.slParties[1] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    if (result > max)
                        max = result;
                    
                    //if ($scope.party.value === 'PAN')
                    //    valWin = result;
                    
                    if ($scope.opt.key === 0) {
                        serie.data.push(serie.data[electionNum - 1]);
                        res = result - serie.data[electionNum - 1];
                        serieProy[1].data.push((res > 0 ? parseInt(res) : parseInt(res)));
                        serieProy[1].stack = 1;
                        chart.addSeries(serieProy[1], false);
                    } 
                    else {
                        serie.data.push(parseInt(result));
                    }
                    break;
                case 2:
                    result = ($scope.infoProj.vPRD * ($scope.slParties[2] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    if (result > max)
                        max = result;
                    
                    //if ($scope.party.value === 'PRD')
                    //    valWin = result;
                    
                    if ($scope.opt.key === 0) {
                        serie.data.push(serie.data[electionNum - 1]);
                        res = result - serie.data[electionNum - 1];
                        serieProy[2].data.push((res > 0 ? parseInt(res) : parseInt(res)));
                        serieProy[2].stack = 2;
                        chart.addSeries(serieProy[2], false);
                    } 
                    else {
                        serie.data.push(null);
                        chart.addSeries(serie, false);
                        serieProy[2].data.push(parseInt(result));
                        serieProy[2].stack = 1;
                        chart.addSeries(serieProy[2], false);
                        continue;
                    }
                    break;
                case 3:
                    result = ($scope.infoProj.vMorena * ($scope.slParties[3] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    if (result > max)
                        max = result;
                    
                    valWin = result;
                    
            }
            
            chart.addSeries(serie, false);
        }
        
        chart.addSeries(serieProy[4], false);
        var color = undefined;
        switch ($scope.party.value) {
            case "PRI":
                color = "#FA1521";
                break;
            case "PAN":
                color = "#044A93";
                break;
            case "PRD":
                color = "#FFDE11";
                break;
        }
        
        serieWinner.color = "#B5261E";
        serieWinner.data.push(parseInt(valWin));
        chart.addSeries(serieWinner);
        
        chart.redraw();
        $scope.serieWinner = serieWinner;

    };
    
    $scope.onSaveProj = function () {
        $scope.isSaving = true;
        $http.post('/cityhall/projectionSaveV4', {
            idMun: $scope.idMun, params: {
                lnInit: $scope.lnIni, totIni: $scope.totIni, lnLast: $scope.lnLast, vtLast: $scope.vtLast, lnCurr: $scope.lnCurr, vtCurr: $scope.vtCurr, 
                vtExt: $scope.vtExt, infoProj: $scope.infoProj, dataSerie: $scope.dataSeries, slPerLn: $scope.slPerLn, 
                slPerVt: $scope.slPerVt, slParties: $scope.slParties, serieWinner: $scope.serieWinner
            }
        }).success(function (data) {
            $scope.isSaving = false;
            if (data.success === true) {
                $scope.msgSucc = data.msg;
            } else {
                $scope.msgError = data.msg;
            }
            
            $timeout(function () {
                $scope.msgSucc = "";
                $scope.msgError = "";
            }, 10000);

        }).error(function (err) {
            $scope.isSaving = false;
            $scope.msgError = "Error de red";
            
            $timeout(function () {
                $scope.msgSucc = "";
                $scope.msgError = "";
            }, 10000);
        });
    };
});