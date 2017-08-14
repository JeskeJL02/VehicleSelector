(function () {
    'use strict';

    angular.module('vehicleSelectorApp').service('dataService', [
        '$http', 'config', function ($http, config) {

            var _get = function (url) {
                return $http({
                    url: config.apiBaseUrl + url,
                    type: 'GET'
                });
            };

            return {
                get: _get
            };
        }
    ]);
})();