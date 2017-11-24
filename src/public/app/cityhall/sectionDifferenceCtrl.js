app.controller('sectionDifferenceController', function ($scope, $http) {

    $scope.init = function() {
        var lstMg = {};
        var lstYears = [];

        for (var i = 0, len = $scope.rows.length; i < len; i++) {
            var row = $scope.rows[i];
            var keyVal = lstMg[row.Anio];
            if (keyVal) {
                lstMg[row.Anio].push({ key: row.IdCandidato, value: row.Integrado, field: row.Campo });
            } else {
                var lstData = [];
                lstData.push({key: row.IdCandidato, value: row.Integrado, field: row.Campo});
                lstMg[row.Anio] = lstData;
                lstYears.push({key: row.Anio, value: row.Anio});
            }
        }

        $scope.lstMg = lstMg;

        $scope.lstYears = lstYears;
        $scope.year = $scope.lstYears[0];
        $scope.onYearChange();
    };

    $scope.onYearChange = function() {
        $scope.lstCandidates = $scope.lstMg[$scope.year.key];
        $scope.candidate = $scope.lstCandidates[0]; 
    };

    $scope.onSearch = function () {
        $http.post('/cityhall/sectionDifferenceData',
            { year: $scope.year, candidate: $scope.candidate, searchType: $scope.searchType, topN: $scope.topN, id: $scope.idMun }).
        success(function (data, status) {
            var rows = data.rows;
            var resRows = [];
            var lstTbCandidates = [];
            
            lstTbCandidates.push($scope.candidate);
            for (var i = 0, lenI = $scope.lstCandidates.length; i < lenI; i++) {
                var candidate = $scope.lstCandidates[i];
                if (candidate.key === $scope.candidate.key)
                    continue;
                lstTbCandidates.push(candidate);
            }
            

            for (var j = 0, len = rows.length; j < len; j++) {
                var row = rows[j];
                var resRow = [];
                var value = 0;
                resRow.push(row.IdSeccion);
                resRow.push(row.Colonia);
                for (i = 0, lenI = lstTbCandidates.length; i < lenI; i++) {
                    candidate = lstTbCandidates[i];
                    resRow.push(row[candidate.field]);
                    if (i === 0)
                        value = row[candidate.field];
                }
                
                for (var k = 0, lenK = $scope.extraColumns.length; k < lenK; i++, k++) {
                    var extra = $scope.extraColumns[k];
                    resRow.push(row[extra.field]);
                }

                resRows.push({data: resRow, value: value});
            }
            
            $scope.lstTbCandidates = lstTbCandidates;
            $scope.resRows = resRows;

        }).error(function (data, status) {
        
        });
    };
});