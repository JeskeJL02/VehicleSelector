(function () {
    'use strict';

    angular
        .module('vehicleSelectorApp')
        .controller('modalController', modalController);

    modalController.$inject = ['$scope', '$uibModalInstance', 'input', 'type', 'id', 'vehicleService'];

    function modalController($scope, $uibModalInstance, input, type, id, vehicleService) {

        $scope.Add = function () {
            var saveSuccess = false;
            var promise = vehicleService.addNew(type, input, id/*parent id*/);
            //dont need to promise chain here, just showing I know how ;)
            promise.then(function (success) {
                saveSuccess = success;
            });
            promise.then(function () {
                $uibModalInstance.close(saveSuccess);
            });
        };

        $scope.Delete = function () {
            var deleteSuccess = false;
            var promise = vehicleService.delete(type, id);
            //dont need to promise chain here, just showing I know how ;)
            promise.then(function (success) {
                deleteSuccess = success;
            });
            promise.then(function () {
                $uibModalInstance.close(deleteSuccess);
            });
        };

        $scope.Cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //init function
        var _setUpModal = function () {
            $scope.Input = input;
            switch (type) {
                case 'make': {
                    $scope.Type = 'makes';
                    break;
                }
                case 'model': {
                    $scope.Type = 'models';
                    break;
                }
            }
        };
        _setUpModal();
    }
})();
