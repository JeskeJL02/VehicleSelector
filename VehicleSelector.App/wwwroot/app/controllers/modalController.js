(function () {
    'use strict';

    angular
        .module('vehicleSelectorApp')
        .controller('modalController', modalController);

    modalController.$inject = ['$scope', '$uibModalInstance', 'input', 'type', 'id', 'vehicleService'];

    function modalController($scope, $uibModalInstance, input, type, id, vehicleService) {

        $scope.Add = function () {
            var promise = vehicleService.addNew(type, input, id/*parent id*/);
            promise.then(function (response) {
                $uibModalInstance.close(response.data);
            });
        };

        $scope.Delete = function () {
            var promise = vehicleService.delete(type, id);
            promise.then(function (success) {
                $uibModalInstance.close(success);
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
