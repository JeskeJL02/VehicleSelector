(function () {
    'use strict';

    angular
        .module('vehicleSelectorApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope'];

    function homeController($scope) {
        //The home page is static and does not require any controller fucntions at this time.
        //However it exists in the case when we do want to add functionality later on. 
    }
})();
