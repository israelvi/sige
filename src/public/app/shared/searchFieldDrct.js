app.directive('fieldSearch', function ($http, $timeout) {
    return function (scope, elem, attr) {

        var currentTimeout = null;

        var urlRequest = attr['urlRequest'];
        var model = attr['ngModel'];

        var ajaxConf = {
            method: 'POST',
            url: urlRequest
        };

        elem.on('keyup change blur', function () {
            var field = scope[model];
            if (field == undefined || field.length < 2 )
                return;

            ajaxConf.params = { field : field};

            if (currentTimeout) {
                $timeout.cancel(currentTimeout);
            }

            currentTimeout = $timeout(function() {

               $http(ajaxConf)
                    .success(function (data) {
                        data.data=jQuery.parseJSON(data.data);

                        if (data.data == undefined || data.data.length === 0) {
                            scope.clear();
                            return;
                        }

                        scope.listLocation = data.data;
                        scope.a.location =scope.listLocation[0];
                        scope.a.locationId = scope.a.location.id;

                    });
            }, 200);
        });
    };
});