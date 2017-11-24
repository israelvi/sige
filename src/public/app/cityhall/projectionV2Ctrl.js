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
    
    $scope.mergeParties = function (res) {
        var vPri = res[0][0].CandidatoB, vPan = res[0][0].CandidatoA, vPrd = res[0][0].CandidatoC;
        var percPri = 0, percPan = 0, percPrd = 0, parc, r2, percLnVsParties = 0;
        var sumPri, sumPan, sumPrd;

        for (var i = 1, len = res.length; i < len; i++) {
            r2 = res[i][0];
            sumPri = (i === 1 ? (r2.CandidatoB + r2.CandidatoF + r2.CandidatoG + r2.CandidatoH + r2.CandidatoI + r2.CandidatoJ) : r2.CandidatoB); 
            parc = (sumPri * 100) / vPri;
            percPri += parc;
            console.log(parc);

            sumPan = r2.CandidatoA;
            parc = ((sumPan) * 100) / vPan;
            percPan += parc;
            console.log(parc);

            sumPrd = (i === 1 ? r2.CandidatoC : r2.CandidatoD);
            parc = (sumPrd * 100) / vPrd;
            percPrd += parc;
            console.log(parc);

            percLnVsParties += ((sumPri + sumPan + sumPrd) / r2.total) * 100;
        }

        i = i - 1;
        percPri = percPri / i;
        percPan = percPan / i;
        percPrd = percPrd / i;
        percLnVsParties = percLnVsParties / i;

        $scope.infoProj['vPRI'] = vPri;// = parseInt(vPri * (percPri / 100.0));
        $scope.infoProj['vPAN'] = vPan;// = parseInt(vPan * (percPan / 100.0));
        $scope.infoProj['vPRD'] = vPrd;// = parseInt(vPrd * (percPrd / 100.0));
        
        //$scope.infoProj['percPri'] = percPri;
        //$scope.infoProj['percPan'] = percPan;
        //$scope.infoProj['percPrd'] = percPrd;
        
        $scope.slPerLn = 50;
        $scope.slPerVt = 50;
        
        $scope.slParties = [parseInt(percPri), parseInt(percPan), parseInt(percPrd), parseInt(percLnVsParties)];
        
        window.scProj = $scope;
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
    
    //CandidatoB":91454,"CandidatoF":10147,"CandidatoG":3733,"CandidatoH":2173,"CandidatoI":622,"CandidatoJ
    $scope.onGenerate = function (chartName) {
        var electionNum = 4;
        var chart = $(chartName).highcharts();
        
        for (var j = chart.series.length - 1; j >= 0; j--) {
            chart.series[j].remove();
        }
        
        var series = $scope.dataSeries, result, res;
        var serieProy = [{ "data": [null, null, null, null], "name": "Proyección", "color": "#FA1521" },
                        { "data": [null, null, null, null], "name": "Proyección", "color": "#044A93" },
                        { "data": [null, null, null, null], "name": "Proyección", "color": "#FFDE11" },
                        { "data": [null, null, null, null], "name": "Votos requeridos", "color": "#FA1521", stack: 3 }];
        
        var serieWinner = { "data": [null, null, null, null], "name": "Ganador: " + $scope.party.value, stack : 3, siglas: $scope.party.value };
        
        var max = 0, valWin;
        var sumTotCalc = 0;
        for (var i = 0, len = series.length; i < len; i++) {
            var serie = series[i];
            serie.data.splice(electionNum);
            switch (i) {
                case 0:
                    result = ($scope.infoProj.vPRI * ($scope.slParties[0] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    
                    break;
                case 1:
                    result = ($scope.infoProj.vPAN * ($scope.slParties[1] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    break;
                case 2:
                    result = ($scope.infoProj.vPRD * ($scope.slParties[2] / 100.0)) * 
                    ((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni)));
                    console.log(((($scope.slPerLn / 100) * ($scope.lnCurr / $scope.lnIni)) + (($scope.slPerVt / 100) * ($scope.vtCurr / $scope.totIni))));
                    break;
            }

            if (i < 3) {
                sumTotCalc += parseInt(result);
                serie.data.push(parseInt(result));
            }

        }

        var totVot = ($scope.vtCurr * $scope.slParties[3]) / sumTotCalc;
        var perctotVot = ((totVot) / 100);

        console.log(totVot);
        console.log(perctotVot);

        var iRes = 0;

        for (i = 0, len = 3; i < len; i++) {
            serie = series[i];
            result = serie.data[3] * perctotVot;
            iRes += result - parseInt(result);

            if (iRes > 1) {
                iRes -= 1;
                result += 1;
            } else if (iRes < -1) {
                iRes += 1;
                result -= 1;
            }

            serie.data[3] = parseInt(result);
            
            if ($scope.opt.key === 0) {
                serie.data[3] = serie.data[2];
                res = result - serie.data[2];
                serieProy[i].data.push(parseInt(res));
                serieProy[i].stack = i;
            }
            
            switch (i) {
                case 0:
                    if (result > max)
                        max = result;
                    if ($scope.party.value === 'PRI')
                        valWin = result;
                    break;
                    
                case 1:
                    if (result > max)
                        max = result;
                    if ($scope.party.value === 'PAN')
                        valWin = result;
                    break;
                    
                case 2:
                    if (result > max)
                        max = result;
                    if ($scope.party.value === 'PRD')
                        valWin = result;
                    break;
            }
        }


        for ( i = 0, len = series.length; i < len; i++) {
            serie = series[i];
            if ($scope.opt.key === 0) {
                chart.addSeries(serieProy[i], false);
            }
            chart.addSeries(serie, false);
        }
        
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
        
        if ($scope.opt.key === 0) {
            serieProy[3].color = color;
            serieProy[3].data.push(parseInt(max - valWin) + parseInt($scope.vtExt));
            chart.addSeries(serieProy[3]);
            serieWinner.color = color;
            serieWinner.data.push(parseInt(valWin));
            chart.addSeries(serieWinner);
        } 
        else {
            serieWinner.color = color;
            serieWinner.data.push(parseInt(max + parseInt($scope.vtExt)));
            chart.addSeries(serieWinner);
        }
        
        chart.redraw();
        $scope.serieWinner = serieWinner;

    };
    
    $scope.onSaveProj = function () {
        $scope.isSaving = true;
        $http.post('/cityhall/projectionV2Save', {
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