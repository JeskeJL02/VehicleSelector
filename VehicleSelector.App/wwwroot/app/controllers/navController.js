(function () {
    'use strict';

    angular
        .module('vehicleSelectorApp')
        .controller('navController', navController);

    navController.$inject = ['$scope', '$location'];

    function navController($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }
})();
