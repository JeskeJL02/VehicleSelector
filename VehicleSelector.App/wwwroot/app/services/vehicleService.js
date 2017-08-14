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

            var _addNew = function (type, name, parentId) {
                return dataService.post('/vehicles/addnew', { ItemType: type, ItemValue: name, ItemParentId: parentId });
            };

            var _delete = function (type, id) {
                return dataService.delete('/vehicles/delete/' + type + '/' + id);
            };

            return {
                getAllVehicleMakes: _getAllVehicleMakes,
                getMakeAndModelsByMakeId: _getMakeAndModelsByMakeId,
                addNew: _addNew,
                delete: _delete
            };
        }
    ]);
})();