/* global controllers */
'use strict';

controllers
  .controller('AppCtrl', function($scope, $ionicModal, $ionicSideMenuDelegate, APPDIR, $state) {
    $scope.APPDIR = APPDIR;
    $scope.menu = [{
      name: 'Practica Solo',
      state: 'app.modes',
      description: 'Entrena antes de la batalla, para ponerte a punto.',
      background: 'alone'
    }, {
      name: 'Batalla',
      state: 'app',
      description: 'Sube a la tarima y demuestra tus habilidades a todo el mundo.',
      background: 'battle'
    }];

    $ionicModal.fromTemplateUrl('app/user/settings.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.settings = modal;
    });
    $scope.openSettings = function() {
      $scope.settings.show();
    };
    $scope.$on('$destroy', function() {
      $scope.settings.remove();
    });
    $scope.details = null;

    $scope.$on('baseDetails', function(event, base) {
      $ionicSideMenuDelegate.toggleRight();
      $scope.details = base;
    });

    $scope.downloadBase = function(base) {
      $ionicSideMenuDelegate.toggleRight();
      $scope.$broadcast('downloadBase', base);
    };

    $scope.goToBase = function(base) {
      $ionicSideMenuDelegate.toggleRight();
      $scope.$broadcast('goToBase', base);
    };

    $scope.shouldRightSideMenuBeEnabled = function() {
      if ($state.current.name === 'app.bases') {
        return true;
      } else {
        return false;
      }
    };
  });
