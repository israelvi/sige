app.controller('byResultController', function ($scope) {
    
    $scope.onSeriesChanged = function () {
        var lstSeries = $scope.buildSerie($scope.infoSeries);
        $scope.addSerie($scope.chartName, lstSeries);
    };
    
    $scope.buildSerie = function (infoSeries) {
        var lstSeries = [];
        for (var i = 0, len = $scope.series.length; i < len; i++) {
            var serie = $scope.series[i];
            var series = [];
            for (var j = 0, lenJ = infoSeries.length; j < lenJ; j++) {
                var infoSerie = infoSeries[j][0];
                var data = infoSerie[serie.key];
                if (data === undefined) continue;
                series.push(data);
            }
            lstSeries.push({ data: series, name: serie.key, color: serie.color });
        }
        
        return lstSeries;
    };
    
    
    $scope.addSerie = function (chartName, serie) {
        var chart = $(chartName).highcharts();
        //remove charts then add
        
        for (var j = chart.series.length - 1; j > 2; j--) {
            chart.series[j].remove();
        }
        
        for (var i = 0, len = serie.length; i < len; i++) {
            var data = serie[i];
            
            chart.addSeries({
                data: data.data,
                type: 'column',
                name: data.name.toUpperCase(),
                color: data.color
            }, false);            
        }
        
        chart.redraw();
    };
});