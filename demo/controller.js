'use strict';

var module = angular.module('demo');

module.controller('DemoCtrl', ['$scope', function ($scope) {

    $scope.inplaceMode = false;
    $scope.disabled = false;
    
    var ali = {
        firstName: 'Mohammad',
        lastName: 'Ali',
        heightInCm: 191
    };

    var tyson = {
        firstName: 'Mike',
        lastName: 'Tyson',
        heightInCm: 178
    };

    $scope.fighter = ali;

    $scope.setFighterAli = function () {$scope.fighter = ali};
    $scope.setFighterTyson = function () {$scope.fighter = tyson};

    $scope.saveChanges = function (property, successCallback, errorCallback) {
        if (parseInt($scope.fighter.heightInCm) < 160) {
            errorCallback({
                'heightInCm': 'Too short'
            });
        } else if (parseInt($scope.fighter.heightInCm) > 210) {
            errorCallback({
                'heightInCm': 'Too tall'
            });
        } else successCallback();
    }
}]);
