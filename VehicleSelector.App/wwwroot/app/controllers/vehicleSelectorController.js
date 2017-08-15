(function () {
    'use strict';

    angular
        .module('vehicleSelectorApp')
        .controller('vehicleSelectorController', vehicleSelectorController);

    vehicleSelectorController.$inject = ['$scope', '$window', '$uibModal', '$timeout', 'vehicleService'];

    function vehicleSelectorController($scope, $window, $uibModal, $timeout, vehicleService) {
        //selected caches
        var _selectedVehicleMakeCache = undefined;
        var _selectedVehicleModelCache = undefined;
        var _vehicleMakeCache = [];

        //global scope variables
        $scope.Alerts = [];
        $scope.SearchArray = [];
        $scope.Selections = [];
        $scope.CurrentInput = undefined;
        $scope.CurrentlySearchingFor = 'Makes';
        $scope.ListVisibility = 'Show List';
        $scope.CollapseList = true;
        $scope.NoResults = false;

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
            }, function () {
                $scope.Alerts.unshift({ type: 'danger', msg: 'Error: Unable to retrieve all vehicle makes.' });
            });
        };

        var _loadVehicleModelsForMake = function (makeId) {
            var promise = vehicleService.getMakeAndModelsByMakeId(makeId);
            promise.then(function (response) {
                _mapToSearchArray(response.data.models, 'model');
            }, function () {
                var message = 'Error: Unable to retrieve vehicle models.';
                if (_selectedVehicleMakeCache !== undefined)
                    message = 'Error: Unable to retrieve vehicle models for ' + _selectedVehicleMakeCache.name + '.';
                $scope.Alerts.unshift({ type: 'danger', msg: message });
            });
        };

        //helper functions
        var _translateCurrentlySearchingForToType = function () {
            switch ($scope.CurrentlySearchingFor) {
                case 'Makes': {
                    return 'make';
                }
                case 'Models': {
                    return 'model';
                }
            }
        };

        var _setListVisiblity = function (CollapseList) {
            switch (CollapseList) {
                case true: {
                    $scope.ListVisibility = 'Show List';
                    break;
                }
                case false: {
                    $scope.ListVisibility = 'Hide List';
                    break;
                }
            }
            $scope.CollapseList = CollapseList;
        };

        var _selectionSet = function (type, fromCache, loadModels) {
            switch (type) {
                case 'root': {
                    //now searching for makes
                    $scope.CurrentlySearchingFor = "Makes";
                    //reset the selected make cache
                    _selectedVehicleMakeCache = undefined;
                    _selectedVehicleModelCache = undefined;
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
                    if (loadModels)
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

        var _selectListItem = function (item) {
            var type = _translateCurrentlySearchingForToType();
            switch (type) {
                case 'make': {
                    _selectedVehicleMakeCache = item;
                    break;
                }
                case 'model': {
                    _selectedVehicleModelCache = item;
                    break;
                }
            }
            _selectionSet(type, true, true);
        };

        var _removeFromSearchArrayByIndex = function (index) {
            //the timeout is so we dont have overlapping animations
            $timeout(function () {
                var removedArr = $scope.SearchArray.splice(index, 1);
                //this chunk of code handles the instance where a user
                //deletes and item they have already selected.
                switch (_translateCurrentlySearchingForToType()) {
                    case 'make': {
                        //if we removed a make there was no selection. do nothing.
                        break;
                    }
                    case 'model': {
                        if (_selectedVehicleModelCache !== undefined) {
                            //if we remove the selected model, go back to make's model select.
                            if (removedArr[0].id === _selectedVehicleModelCache.id) {
                                $scope.Selections.splice(2, $scope.Selections.length - 2);
                                _selectedVehicleModelCache = undefined;
                            }
                        }
                        break;
                    }
                }
            }, 200);
        };

        var _insertIntoSearchArrayAlphaBetically = function (newItem) {
            if ($scope.SearchArray.length > 0) {
                var _searchArrayCopy = [];
                //we are making a copy of the search array so we can 
                //add the new item, sort the array, and find where the
                //new items index would be alphabetically.
                angular.copy($scope.SearchArray, _searchArrayCopy);
                _searchArrayCopy.push(newItem);
                //the compare function to sort the name alphabetically.
                var _compareFn = function (a, b) {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                };
                //sort array
                _searchArrayCopy.sort(_compareFn);
                //get index of newItem
                var _insertIndex = _searchArrayCopy.indexOf(newItem);
                //timeout to prevent overlapping animations.
                $timeout(function () {
                    $scope.SearchArray.splice(_insertIndex, 0, newItem);
                }, 200);
            } else {
                $scope.SearchArray.push(newItem);
            }
        };

        var _handleModalResponse = function (response, input, index, deleteId) {
            response.then(function (action) {
                var _type = _translateCurrentlySearchingForToType();
                //the action is what the user decided to click in the modal.
                switch (action) {
                    case 'add': {
                        //get values to add
                        //parent id will be -1 if type is make
                        var _parentId = -1;
                        switch (_type) {
                            case 'model': {
                                _parentId = _selectedVehicleMakeCache.id;
                                break;
                            }
                            case 'year': {
                                //!!NOT YET IMPLEMENTED!!
                                _parentId = _selectedVehicleModelCache.id;
                                break;
                            }
                        }
                        //create promise
                        var addPromise = vehicleService.addNew(_type, input, _parentId);
                        addPromise.then(function (response) {
                            var newId = response.data;
                            //for an add if the api returns a number other than -1 the save was successful.
                            if (!isNaN(newId) && parseInt(newId) !== -1) {
                                //clear search criteria
                                $scope.NoResults = false;
                                $scope.CurrentInput = undefined;
                                var newItem = { id: newId, name: input };
                                //make new item the selection.
                                _selectListItem(newItem);
                                //if model insert with animation, if no a new list will be loaded so the animation is not necessary.
                                if (_type === 'model')
                                    _insertIntoSearchArrayAlphaBetically(newItem);
                                $scope.Alerts.unshift({ type: 'success', msg: 'Successfully added ' + input + ' to vehicle ' + _type + 's.' });
                            } else {
                                $scope.Alerts.unshift({ type: 'danger', msg: 'Error: Unable to add ' + input + ' to vehicle ' + _type + 's.' });
                            }
                        });
                        break;
                    }
                    case 'delete': {
                        var deletePromise = vehicleService.delete(_type, deleteId);
                        deletePromise.then(function (success) {
                            if (success) {
                                _removeFromSearchArrayByIndex(index);
                                $scope.Alerts.unshift({ type: 'success', msg: 'Successfully deleted vehicle ' + _type + '.' });
                            } else {
                                $scope.Alerts.unshift({ type: 'danger', msg: 'Error: Unable to delete vehicle ' + _type + '.' });
                            }
                        });
                        break;
                    }
                }
            });
        };

        //scope functions
        $scope.SelectionSet = function (type) {
            _selectionSet(type, true, false);
        };

        $scope.KeyUpEvent = function (event) {
            if ((event.key === 'Enter' || event.keyCode === 13/*Enter*/) && typeof $scope.CurrentInput === 'string') {
                //modal => 'are you sure you want to add "blah" to the list of makes'
                if ($scope.CurrentInput.trim() !== '') {
                    var _type = _translateCurrentlySearchingForToType();
                    var _input = $scope.CurrentInput.trim();
                    var modalInstance = $uibModal.open({
                        templateUrl: 'addNewModal.html',
                        controller: 'modalController',
                        animation: false,
                        resolve: {
                            input: function () {
                                return _input;
                            },
                            type: function () {
                                return _type;
                            }
                        }
                    });

                    _handleModalResponse(modalInstance.result, _input, null, null);
                }
            }
        };

        $scope.SelectEvent = function () {
            var type = _translateCurrentlySearchingForToType();
            _selectionSet(type, false, true);
        };

        $scope.SelectItem = function (id, name) {
            _selectListItem({ id: id, name: name });
        };

        $scope.SetListVisiblity = function () {
            _setListVisiblity(!$scope.CollapseList);
        };

        $scope.DeleteItem = function (id, name, index) {
            var _type = _translateCurrentlySearchingForToType();
            
            var modalInstance = $uibModal.open({
                templateUrl: 'deleteModal.html',
                controller: 'modalController',
                animation: false,
                resolve: {
                    input: function () {
                        return name;
                    },
                    type: function () {
                        return _type;
                    }
                }
            });

            _handleModalResponse(modalInstance.result, null, index, id);
        };

        $scope.closeAlert = function (index) {
            $scope.Alerts.splice(index, 1);
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
