(function () {
    'use strict';

    angular.module('vehicleSelectorApp').service('vehicleService', [
        'dataService', function (dataService) {

            var _getAllVehicleMakes = function () {
                return dataService.get('/vehicles/getallmakes');
            };

            var _getMakeAndModelsByMakeId = function (makeId) {
                return dataService.get('/vehicles/getmake/' + makeId);
            };


            return {
                getAllVehicleMakes: _getAllVehicleMakes,
                getMakeAndModelsByMakeId: _getMakeAndModelsByMakeId
            };
        }
    ]);
})();