app.controller('pollingProjectionController', function ($scope, $http, $timeout) {

    $scope.initialize = function () {
        $scope.lstPartiesToShow = [{ Party: 'PAN', Pos: 1 }, { Party: 'PRI', Pos: 0 }, { Party: 'PRD', Pos: 2 }];

        var lstParties = [];

        if ($scope.rows === undefined || $scope.rows.length === 0)
            return;

        for (var i = 0, len = $scope.rows.length; i < len; i++) {
            var row = $scope.rows[i];
            lstParties.push({key: row.KeyParam, value: row.KeyParam.replace('SAVE_PROJ_MUN_', ''), fullValue: JSON.parse(row.ValueParam)});
        }

        $scope.lstParties = lstParties;
        $scope.party = lstParties[0];

        $scope.onChangeParty();
    };

    $scope.onChangeParty = function () {
        var fullValue = $scope.party.fullValue;
        $scope.ln2012 = fullValue.ln2012;
        $scope.vt2012 = fullValue.vt2012;
        $scope.ln2015 = fullValue.ln2015;
        $scope.vt2015 = fullValue.vt2015;
        $scope.slPerLn = fullValue.slPerLn;
        $scope.slPerVt = fullValue.slPerVt;
        $scope.vtExt = fullValue.vtExt;
        $scope.slParties = fullValue.slParties;
        $scope.vtWin = fullValue.serieWinner.data[3];

        $scope.estimation = [];

        for (var j = 0; j < $scope.lstPartiesToShow.length; j++) {
            var party = $scope.lstPartiesToShow[j];
            for (var i = 0; i < fullValue.dataSerie.length; i++) {
                var serie = fullValue.dataSerie[i];
                if (party.Party === serie.name) {
                    $scope.estimation.push(serie.data[3]);
                    break;
                }
            }
        }

        $scope.winnerProy = {};

        for (j = 0; j < $scope.lstPartiesToShow.length; j++) {
            party = $scope.lstPartiesToShow[j];
            party.factor = fullValue.dataSerie[party.Pos].data[3] / fullValue.dataSerie[party.Pos].data[2];
            party.rest = 0;

            if (fullValue.serieWinner.siglas === party.Party) {
                $scope.winnerProy.factor = fullValue.serieWinner.data[3] / fullValue.dataSerie[party.Pos].data[2];
                $scope.winnerProy.rest = 0;
            }
        }

        $scope.rowsElec = [];
        $scope.rest = 0;
        var ln2015Proy, partyProy;

        var totals = {};
        var lnResNew = 0;

        var factorLn = $scope.ln2015 / $scope.ln2012; 
        for (j = 0; j < $scope.resElec.length; j++) {
            var resRow = $scope.resElec[j];

            ln2015Proy = resRow.ListaNominal * factorLn;
            resRow.ln2015Proy = parseInt(ln2015Proy);
            $scope.rest = $scope.rest + (ln2015Proy - resRow.ln2015Proy);

            if ($scope.rest > 1.0) {
                resRow.ln2015Proy = resRow.ln2015Proy + 1;
                $scope.rest = $scope.rest - 1;
            } else if($scope.rest < -1.0 && resRow.ln2015Proy > 0) {
                resRow.ln2015Proy = resRow.ln2015Proy - 1;
                $scope.rest = $scope.rest + 1;            
            }

            if (totals.ListaNominal === undefined) totals.ListaNominal = 0;
            totals.ListaNominal += resRow.ListaNominal;
            if (totals.ln2015Proy === undefined) totals.ln2015Proy = 0;
            totals.ln2015Proy += resRow.ln2015Proy;


            //Partidos
            for (var k = 0; k < $scope.lstPartiesToShow.length; k++) {
                party = $scope.lstPartiesToShow[k];
                partyProy = resRow[party.Party] * party.factor;

                if (partyProy < 1 && k === 0)
                    lnResNew += resRow.ListaNominal;
                
                resRow[party.Party + 'Est'] = parseInt(partyProy);
                party.rest = party.rest + (partyProy - resRow[party.Party + 'Est']);
                
                if (party.rest > 1.0) {
                    resRow[party.Party + 'Est'] = resRow[party.Party + 'Est'] + 1;
                    party.rest = party.rest - 1;
                } else if (party.rest < -1.0 && resRow[party.Party + 'Est'] > 0) {
                    resRow[party.Party + 'Est'] = resRow[party.Party + 'Est'] - 1;
                    party.rest = party.rest + 1;
                }
                
                if (fullValue.serieWinner.siglas === party.Party) {
                    partyProy = resRow[party.Party] * $scope.winnerProy.factor;
                    resRow[party.Party + 'Proy'] = parseInt(partyProy);
                    $scope.winnerProy.rest = $scope.winnerProy.rest + (partyProy - resRow[party.Party + 'Proy']);
                    
                    if ($scope.winnerProy.rest > 1.0) {
                        resRow[party.Party + 'Proy'] = resRow[party.Party + 'Proy'] + 1;
                        $scope.winnerProy.rest = $scope.winnerProy.rest - 1;
                    } else if ($scope.winnerProy.rest < -1.0 && resRow[party.Party + 'Proy'] > 0) {
                        resRow[party.Party + 'Proy'] = resRow[party.Party + 'Proy'] - 1;
                        $scope.winnerProy.rest = $scope.winnerProy.rest + 1;
                    }
                    
                    if (totals[party.Party + 'Proy'] === undefined) totals[party.Party + 'Proy'] = 0;
                    totals[party.Party + 'Proy'] += resRow[party.Party + 'Proy'];
                }

                if (totals[party.Party] === undefined) totals[party.Party] = 0;
                totals[party.Party] += resRow[party.Party];
                if (totals[party.Party + 'Est'] === undefined) totals[party.Party + 'Est'] = 0;
                totals[party.Party + 'Est'] += resRow[party.Party + 'Est'];

            }           
            $scope.rowsElec.push(resRow);
        }


        var partiesDif = [], dif;
        for (k = 0; k < $scope.lstPartiesToShow.length; k++) {
            dif = $scope.estimation[k] - totals[$scope.lstPartiesToShow[k].Party + 'Est'];
            partiesDif.push({perc: dif/lnResNew, tRes: dif, res: 0});
        }

        dif = $scope.vtWin - totals[fullValue.serieWinner.siglas + 'Proy'];
        var winDif = { perc: dif / lnResNew, tRes: dif, res: 0 };

        //alert(JSON.stringify(partiesDif));

        var poll, len, res;
        //Corrección de nuevas casillas
        for (j = 0; j < $scope.rowsElec.length; j++) {
            resRow = $scope.rowsElec[j];

            for (k = 0, len = $scope.lstPartiesToShow.length; k < len; k++) {
                party = $scope.lstPartiesToShow[k];
                poll = resRow[party.Party];

                if (poll > 0 && k === 0)
                    break;

                res = resRow.ListaNominal * partiesDif[k].perc;
                partiesDif[k].res += res - parseInt(res);
                resRow[party.Party + 'Est'] = parseInt(res);
                
                if (partiesDif[k].res > 1.0) {
                    resRow[party.Party + 'Est'] = resRow[party.Party + 'Est'] + 1;
                    partiesDif[k].res--;
                } else if (party.rest < -1.0 && resRow[party.Party + 'Est'] > 0) {
                    resRow[party.Party + 'Est'] = resRow[party.Party + 'Est'] - 1;
                    partiesDif[k].res++;
                }
                
                if (fullValue.serieWinner.siglas === party.Party) {
                    res = resRow.ListaNominal * winDif.perc;
                    winDif.res += res - parseInt(res);
                    resRow[party.Party + 'Proy'] = parseInt(res);
                    
                    if (winDif.res > 1.0) {
                        resRow[party.Party + 'Proy'] = resRow[party.Party + 'Proy'] + 1;
                        winDif.res--;
                    } else if (party.rest < -1.0 && resRow[party.Party + 'Proy'] > 0) {
                        resRow[party.Party + 'Proy'] = resRow[party.Party + 'Proy'] - 1;
                        winDif.res++;
                    }   
                    totals[party.Party + 'Proy'] += resRow[party.Party + 'Proy'];
                }

                totals[party.Party + 'Est'] += resRow[party.Party + 'Est'];
                
            }
        }

        $scope.totals = totals;
    };
    
    $scope.exportData = function (id) {
        var blob = new Blob([document.getElementById(id).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "ReporteCasillas.xls");
    };
});