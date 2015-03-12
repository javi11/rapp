'use strict';

angular.module('starter.controllers.BasesCtrl', [])
  .controller('BasesCtrl', function($scope, $stateParams) {
    $scope.recording = false;

    $scope.record = function() {
      console.log($scope.recording);
      if (!$scope.recording) {
        //Grabar
        $scope.recording = true;
      } else {
        //Parar de grabar
        $scope.recording = false;
      }
    };
    $scope.bases = [{
      title: 'Reggae',
      id: 1
    }, {
      title: 'Chill',
      id: 2
    }, {
      title: 'Dubstep',
      id: 3
    }, {
      title: 'Indie',
      id: 4
    }, {
      title: 'Rap',
      id: 5
    }, {
      title: 'Cowbell',
      id: 6
    }];

    if ($stateParams.id) {
      $scope.title = $scope.bases[$stateParams.id].title;
    }
  });
