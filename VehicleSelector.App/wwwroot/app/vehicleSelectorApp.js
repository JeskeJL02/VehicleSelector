(function () {
    'use strict';

    angular.module('vehicleSelectorApp', [
        // Angular modules 
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap'
        // Custom modules 

        // 3rd Party Modules

    ])
        .config([
            '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
                var _vehicleSelectorViewsRootPath = '/app/views/vehicleSelector/';
                var _homeViewsRootPath = '/app/views/home/';
                //removing the has prefix
                $locationProvider.hashPrefix('');

                $routeProvider.when('/selector', {
                    controller: 'vehicleSelectorController',
                    templateUrl: _vehicleSelectorViewsRootPath + 'selector.html',
                    title: 'Vehicle Selector'
                });

                $routeProvider.when('/', {
                    controller: 'homeController',
                    templateUrl: _homeViewsRootPath + 'home.html',
                    title: 'Home'
                });

                $routeProvider.otherwise({
                    redirectTo: '/'
                });
            }
        ])
        .run([
            '$http', '$rootScope', function ($http, $rootScope) {
                //jump to top of page on template change
                $rootScope.$on('$locationChangeSuccess', function (event) {
                    window.scrollTo(0, 0);
                });

                $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                    if (current.hasOwnProperty('$$route')) {
                        $rootScope.title = current.$$route.title;
                        window.document.title = $rootScope.title;
                    }
                });
            }

        ])
        .factory('config', function () {
            return {
                apiBaseUrl: 'http://vehicleselectorapi.azurewebsites.net/api'
            }
        });
})();