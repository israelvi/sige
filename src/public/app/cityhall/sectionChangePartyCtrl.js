app.controller('sectionChangePartyController', function ($scope, $http, $timeout) {
    
    $scope.lstPartiesIn = [{ key: 1, value: 'PRI', color: '#F6111B' }, { key: 2, value: 'PAN', color: '#00468E' }, { key: 3, value: 'PRD', color: '#FFD90A' }];
    $scope.lstYearsIn = [2006, 2009, 2012, 2015];
    
    $scope.getSections = function (val) {
        $scope.msgError = "";
        return $http.post('/cityhall/sectionSearchByTypeAhead', {
            params: {
                field: val
                , id: $scope.idMun
            }
        }).then(function (response) {
            return response.data.rows.map(function (item) {
                return item.IdSeccion;
            });
        });
    };
    
    $scope.getLocations = function (val) {
        $scope.msgError = "";
        return $http.post('/cityhall/locationSearchByTypeAhead', {
            params: {
                field: val
                , id: $scope.idMun
            }
        }).then(function (response) {
            return response.data.rows.map(function (item) {
                return item.Colonia;
            });
        });
    };
    
    $scope.addSection = function () {
        $scope.msgError = "";
        var value = $scope.section;
        if (!value) {
            $scope.msgError = "Debe definir una sección";
        }
        
        $http.post('/cityhall/sectionChangePartyAddSection',
            { value: value, id: $scope.idMun }).
            success(function (data) {
            $scope.processData(data, true);
        });
    };
    
    $scope.addLocation = function () {
        $scope.msgError = "";
        var value = $scope.location;
        if (!value) {
            $scope.msgError = "Debe definir una colonia";
        }
        
        $http.post('/cityhall/sectionChangePartyAddLocation',
            { value: value, id: $scope.idMun }).
            success(function (data) {
            $scope.processData(data, true);
        });
    };
    
    $scope.onDelete = function (index) {
        $scope.lstRows.splice(index, 1);
        $scope.calculateTotals();
    };
    
    $scope.calculateTotals = function () {
        var total = { PRI: [0, 0, 0], PAN: [0, 0, 0], PRD: [0, 0, 0]};
        var rows = $scope.lstRows;

        var lstParties = $scope.lstPartiesIn;
        var lstYears = $scope.lstYearsIn;
        for (var i = 0, lenI = rows.length; i < lenI; i++) {
            var r = rows[i];
            for (var k = 0, lenK = lstYears.length; k < lenK; k++) {
                var year = lstYears[k];
                var yearSin = year % 100;

                for (var p = 0, lenP = lstParties.length; p < lenP; p++) {
                    var party = lstParties[p];
                    var partyVot = r.Rows[(party.value + yearSin)];
                    total[party.value][k] += partyVot;
                }
            }
        }

        $scope.total = total;
    };
    
    $scope.onSearch = function () {
        $scope.msgError = "";
        $http.post('/cityhall/sectionChangePartyData',
            { party: $scope.party, sectionType: $scope.sectionType, topN: $scope.topN, id: $scope.idMun }).
        success(function (data) {
            $scope.processData(data, false);
        }).error(function (data, status) {
            
        });
    };
    
    $scope.processData = function (data, hasToAdd) {
        var rows = data.rows;
        
        if (!rows || rows.length === 0) {
            $scope.msgError = "No se encontraron secciones con el criterio seleccionado";
        }
        
        var lstRows = [];
        for (var j = 0, len = rows.length; j < len; j++) {
            var row = rows[j];
            lstRows.push({ IdSeccion: row.IdSeccion, Colonia: row.Colonia, Rows: row });
        }
        
        if (!$scope.lstRows)
            $scope.lstRows = [];
        
        if (hasToAdd) {
            for (var z = 0; z < len; z++) {
                var inRow = lstRows[z];
                $scope.lstRows.unshift(inRow);
            }
        } else {
            $scope.lstRows = lstRows;
        }
        
        $scope.calculateTotals();
        
        $timeout(function () {
            var lstParties = $scope.lstPartiesIn;
            var lstYears = $scope.lstYearsIn;
            for (var i = 0, lenI = rows.length; i < lenI; i++) {
                var r = rows[i];
                for (var k = 0, lenK = lstYears.length; k < lenK; k++) {
                    var year = lstYears[k];
                    var yearSin = year % 100;
                    var name = "pieGraph" + year + "-" + r.IdSeccion;
                    var result = "Result" + year;
                    var partyWin = lstParties[r[result] - 1];
                    var dataSer = [];
                    
                    for (var p = 0, lenP = lstParties.length; p < lenP; p++) {
                        var party = lstParties[p];
                        var partyVot = r[(party.value + yearSin)];
                        if (party.key === partyWin.key) {
                            dataSer.push({
                                name: party.value,
                                y: partyVot,
                                sliced: true,
                                selected: true,
                                color: party.color
                            });
                        } else {
                            dataSer.push({
                                name: party.value,
                                y: partyVot,
                                color: party.color
                            });
                        }
                    }
                    
                    var series = [{
                            type: 'pie',
                            name: 'Votaciones',
                            data: dataSer
                        }];
                    
                    $("." + name).highcharts({
                        chart: {
                            height: 290,
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: '<span style="color:' + partyWin.color + '; font-weight:bold">' + partyWin.value + '</span>'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}) %'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<span style="color:{point.color}; font-weight:bold">{point.name}</span>: <b>{point.y}</b> ({point.percentage:.1f}) %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                },
                                showInLegend: true
                            }
                        },
                        series: series
                    });
                }
            }
        }, 1000);
    };
});