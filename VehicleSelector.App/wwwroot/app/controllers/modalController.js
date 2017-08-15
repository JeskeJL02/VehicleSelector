(function () {
    'use strict';

    angular
        .module('vehicleSelectorApp')
        .controller('modalController', modalController);

    modalController.$inject = ['$scope', '$uibModalInstance', 'input', 'type'];

    function modalController($scope, $uibModalInstance, input, type) {

        $scope.Add = function () {
            $uibModalInstance.close('add');
        };

        $scope.Delete = function () {
            $uibModalInstance.close('delete');
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
