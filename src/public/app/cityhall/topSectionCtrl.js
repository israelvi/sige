app.controller('topSectionController', function ($scope, $http) {
    $scope.isVisible = false;
    
    $scope.onSearch = function () {
        $http.post('/cityhall/topSectionData',
            { year: $scope.year, candidate: $scope.candidate, searchType: $scope.searchType, topN: $scope.topN, id: $scope.idMun }).
        success(function (data) {
            var categories = [];
            var serie = [];
            var location = {};
            var totalVot = 0;

            for (var i = 0, len = data.rows.length; i < len; i++) {
                var row = data.rows[i];
                categories.push("" + row.IdSeccion);
                totalVot += row.SecVot;
                serie.push(row.SecVot);
                location[row.IdSeccion] = row.Colonia;
            }

            $scope.totalVot = totalVot;

            var chart = $($scope.chartName).highcharts();
            
            for (var j = chart.series.length - 1; j > -1; j--) {
                chart.series[j].remove();
            }
            
            chart.xAxis[0].setCategories(categories, false);

            chart.addSeries({
                data: serie,
                location: location,
                name: data.siglas,
                color: data.color
            }, false);
            
            chart.redraw();
            $scope.isVisible = true;

        }).error(function (data, status) {
        
        });

    };
});