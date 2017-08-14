(function () {
    'use strict';

    angular
        .module('vehicleSelectorApp')
        .controller('vehicleSelectorController', vehicleSelectorController);

    vehicleSelectorController.$inject = ['$scope', '$window', 'vehicleService'];

    function vehicleSelectorController($scope, $window, vehicleService) {
        //selected caches
        var _selectedVehicleMakeCache = undefined;
        var _selectedVehicleModelCache = undefined;
        var _vehicleMakeCache = [];
        
        //global scope variables
        $scope.SearchArray = [];
        $scope.Selections = [];
        $scope.CurrentInput = undefined;
        $scope.CurrentlySearchingFor = "Makes";

        //data functions
        var _mapToSearchArray = function (inputArray, arrayType) {
            $scope.SearchArray = inputArray.map(function (obj) {
                switch (arrayType) {
                    case 'make': {
                        return { 'id': obj.vehicleMakeId, 'name': obj.vehicleMakeName };
                    }
                    case 'model': {
                        return { 'id': obj.vehicleModelId, 'name': obj.vehicleModelName };
                    }
                }
            });
        };

        var _loadVehicleMakes = function () {
            var promise = vehicleService.getAllVehicleMakes();
            promise.then(function (response) {
                _vehicleMakeCache = response.data;
                _mapToSearchArray(response.data, 'make');
            });
        };

        var _loadVehicleModelsForMake = function (makeId) {
            var promise = vehicleService.getMakeAndModelsByMakeId(makeId);
            promise.then(function (response) {
                _mapToSearchArray(response.data.models, 'model');
            });
        };

        //selection functions
        var _selectionSet = function (type, fromCache) {
            switch (type) {
                case 'root': {
                    //now searching for makes
                    $scope.CurrentlySearchingFor = "Makes";
                    //reset the selected make cache
                    _selectedVehicleMakeCache = undefined;
                    //remove the selections from the bread crumbs
                    $scope.Selections.splice(1, $scope.Selections.length - 1);
                    //map the vehicle make cache back the typeahead search array
                    _mapToSearchArray(_vehicleMakeCache, 'make');
                    break;
                }
                case 'make': {
                    //now searching for models 
                    $scope.CurrentlySearchingFor = "Models";
                    //setting the cache variable 
                    _selectedVehicleMakeCache = fromCache ? _selectedVehicleMakeCache : $scope.CurrentInput;
                    //rewind breadcrumbs back to 'All Makes'
                    $scope.Selections.splice(1, $scope.Selections.length - 1);
                    //add new selection to breadcrumb
                    $scope.Selections.push({ 'name': _selectedVehicleMakeCache.name, 'type': 'make' });
                    //load the models for the selected make
                    _loadVehicleModelsForMake(_selectedVehicleMakeCache.id);
                    break;
                }
                case 'model': {
                    //setting the cache variable 
                    _selectedVehicleModelCache = fromCache ? _selectedVehicleModelCache : $scope.CurrentInput;
                    //rewind breadcrumbs back to '[Make]'
                    $scope.Selections.splice(2, $scope.Selections.length - 2);
                    //add new selection to breadcrumb
                    $scope.Selections.push({ 'name': _selectedVehicleModelCache.name, 'type': 'model' });
                    break;
                }
                case 'year': {
                    //!!NOT YET IMPLEMENTED!!
                    break;
                }
            }
            $scope.CurrentInput = undefined;
            //set focus to select textbox
            var element = $window.document.getElementById('searchBox');
            if (element)
                element.focus();
        };

        //scope functions
        $scope.SelectionSet = function (type) {
            _selectionSet(type, true);
        };

        $scope.KeyUpEvent = function (event) {
            if ((event.key === 'Enter' || event.keyCode === 13/*Enter*/) && typeof $scope.CurrentInput === 'string') {
                //modal => 'are you sure you want to add "blah" to the list of makes'
            }
        };

        $scope.SelectEvent = function () {
            switch ($scope.CurrentlySearchingFor){
                case 'Makes': {
                    _selectionSet('make', false);
                    break;
                }
                case 'Models': {
                    _selectionSet('model', false);
                    break;
                }
            }
        };

        //init function
        var _init = function () {
            //populate the vehicle make cache
            _loadVehicleMakes();
            //Create the root selection object and push it to the selection array.
            //This will never be removed and the user can click on 'All Makes' to start
            //the selection process over.
            $scope.Selections.push({ 'name': 'All Makes', 'type': 'root' });
        };
        //initialize the controller
        _init();
    }
})();
