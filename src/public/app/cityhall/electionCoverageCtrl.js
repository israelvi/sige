app.controller('electionCoverageController', function ($scope, $http, $timeout) {
    
    $scope.vm = {};
    $scope.vm.sections = [];
    
    $scope.initialize = function () {
        if (!$scope.coverage || $scope.coverage.length === 0)
            return;
        
        $timeout(function () {
            $scope.initMap();
        }, 1000);
    };
    
    $scope.initMap = function () {
        try {
            var coverages = JSON.parse($scope.coverage[0].Cobertura);
            var position;
            var i, k;
            
            for (i = coverages.length - 1; i > -1; i--) {
                var coverage = coverages[i];
                var path = coverage.path;
                var coordinates = [];
                for (k = path.length - 1; k > -1; k--) {
                    var vertex = path[k];
                    position = new google.maps.LatLng(vertex.lat, vertex.lng);
                    coordinates.push(position);
                }
                var polygon = $scope.createPolygon(coordinates, coverage.color, coverage.sectionId);
                $scope.vm.sections.push(polygon);
            }

        } catch (e) {
            $scope.setError(e.message);
        }
    };
    
    $scope.addCoverage = function () {
        
        $scope.errorMsg = "";
        if (!$scope.currSection || $scope.currSection.length != 4) {
            $scope.setError("Debe introducir una sección válida (tamaño 4 caracteres)");
            return;
        }
        
        if ($scope.findItem($scope.vm.sections, $scope.currSection)) {
            $scope.setError("Ya existe una sección con ese número");
            return;
        }
        
        var polygon = $scope.createPolygon($scope.createCoordinates(), '#00ABA9', $scope.currSection);
        
        $scope.vm.sections.push(polygon);

    };
    
    $scope.assignCoverage = function () {
        if ($scope.findItem($scope.vm.sections, $scope.currSection)) {
            $scope.setError("No es posible asignar la sección " + $scope.currSection + " porque, ya existe una cobertura asignada a esa sección");
            return;
        }
        
        $scope.currPolygonSel.sectionId = $scope.currSection;
    };
    
    $scope.findItem = function (catalog, id) {
        for (var i = 0; i < catalog.length; i++) {
            if (catalog[i].sectionId === id)
                return true;
        }
        return false;
    };
    
    $scope.selectSection = function (polygon, isInContext) {
        $scope.clearSelected();
        polygon.setOptions({
            fillOpacity: 0.5
        });
        
        if (isInContext) {
            $scope.currPolygonSel = polygon;
            $scope.currSection = polygon.sectionId;
        } 
        else {
            $scope.$apply(function () {
                $scope.currPolygonSel = polygon;
                $scope.currSection = polygon.sectionId;
            });
        }
    };
    
    $scope.createPolygon = function (coordinates, color, id) {
        var polygon = new google.maps.Polygon({
            map: window.appGlobalMap,
            paths: coordinates,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.1,
            zIndex: -1,
            draggable: true,
            editable: true
        });
        
        polygon.sectionId = id;
        
        $scope.selectSection(polygon, true);
        
        polygon.addListener('click', function () {
            $scope.selectSection(polygon, false);
            //setsectionByPoly(polygon);
        });
        
        polygon.addListener('dblclick', function (e) {
            if (e.vertex > -1) {
                var path = polygon.getPath();
                path.removeAt(e.vertex);
                if (path.length === 2) {
                    $scope.$apply(function () {
                        $scope.currPolygonSel = polygon;
                        $scope.delCoverage();
                    });
                    
                }
            }
        });
        
        return polygon;
    };
    
    $scope.clearSelected = function () {
        for (var i = 0; i < $scope.vm.sections.length; i++) {
            var polygon = $scope.vm.sections[i];
            polygon.setOptions({
                fillOpacity: 0.1
            });
        }
    };
    
    $scope.deleteCoverage = function () {
        if (!$scope.currPolygonSel) return;
        var currPoly = $scope.currPolygonSel;
        $scope.currPolygonSel = undefined;
        
        for (var i = 0; i < $scope.vm.sections.length; i++) {
            if (currPoly === $scope.vm.sections[i]) {
                currPoly.setMap(null);
                $scope.vm.sections.splice(i, 1);
                return;
            }
        }
    };
    
    $scope.createCoordinates = function () {
        var bound = window.appGlobalMap.getBounds().toJSON();
        var sizLat = Math.abs(bound.north - bound.south) / 8;
        var sizLng = Math.abs(bound.east - bound.west) / 8;
        var lat = window.appGlobalMap.center.lat();
        var lng = window.appGlobalMap.center.lng();
        
        var corners = [];
        corners.push([lat - sizLat, lng - sizLng]);
        corners.push([lat + sizLat, lng - sizLng]);
        corners.push([lat + sizLat, lng + sizLng]);
        corners.push([lat - sizLat, lng + sizLng]);
        
        var coordinates = [];
        
        for (var i = 0; i < corners.length; i++) {
            var position = new google.maps.LatLng(corners[i][0], corners[i][1]);
            coordinates.push(position);
        }
        
        return coordinates;
    };
    
    $scope.setError = function (msg) {
        $scope.errorMsg = msg;
        $timeout(function () {
            if (msg === $scope.errorMsg)
                $scope.errorMsg = "";
        }, 20000);
    };
    
    $scope.setSuccess = function (msg) {
        $scope.successMsg = msg;
        $timeout(function () {
            if (msg === $scope.successMsg)
                $scope.successMsg = "";
        }, 20000);
    };
    
    $scope.saveCoverage = function () {
        try {
            $scope.working = true;
            var sections = $scope.vm.sections;
            var dataToSend = {};
            
            var sectionsToSend = [];
            for (var i = sections.length - 1; i > -1; i--) {
                var polygon = sections[i];
                var path = [];
                polygon.getPath().forEach(function (pos, index) {
                    path.push({ i: index, lat: pos.lat(), lng: pos.lng() });
                });
                
                var polygonObj = { path: path, sectionId: polygon.sectionId, color: polygon.fillColor };
                
                sectionsToSend.push(polygonObj);
            }
            
            dataToSend.id = $scope.idMun;
            dataToSend.sections = JSON.stringify(sectionsToSend);
            $http.post('/cityhall/electionCoverageSave', dataToSend).success($scope.handleSuccess).error($scope.handleError);

        } catch (e) {
            $scope.working = false;
            $scope.setError("Se generó el siguiente error: " + e, "Error al guardar la información");
        }
    };
    
    $scope.handleSuccess = function (res) {
        $scope.working = false;
        try {
            if (res.hasError) {
                $scope.setError(res.msg);
            } else {
                $scope.setSuccess(res.msg);
            }
        } catch (e) {
            $scope.setError("Se generó el siguiente error: " + e, "Error al obtener la respuesta");
        }
    };
    
    $scope.handleError = function (e) {
        $scope.working = false;
        $scope.setError("Error: " + e.data + " | Estatus: " + e.status, "Petición fallida");
    };

});