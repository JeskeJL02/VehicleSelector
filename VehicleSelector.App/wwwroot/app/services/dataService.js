(function () {
    'use strict';

    angular.module('vehicleSelectorApp').service('dataService', [
        '$http', 'config', function ($http, config) {

            var _get = function (url) {
                return $http({
                    url: config.apiBaseUrl + url,
                    method: 'GET'
                });
            };

            var _post = function (url, data) {
                return $http({
                    url: config.apiBaseUrl + url,
                    method: 'POST',
                    data: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            };

            var _delete = function (url) {
                return $http({
                    url: config.apiBaseUrl + url,
                    method: 'DELETE'
                });
            };

            return {
                get: _get,
                post: _post,
                delete: _delete
            };
        }
    ]);
})();