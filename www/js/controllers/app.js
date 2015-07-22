/* global app */
'use strict';

app.controller('AppCtrl', function($scope, $ionicModal) {
  $scope.menu = [{
    name: 'Practica Solo',
    href: '#/app/bases',
    description: 'Entrena antes de la batalla, para ponerte a punto.',
    background: 'alone'
  }, {
    name: 'Batalla',
    href: '#/',
    description: 'Entra en el ring y demuestra tus habilidades a todo el mundo.',
    background: 'battle'
  }];

  $ionicModal.fromTemplateUrl('templates/settings.html', {
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

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.login = modal;
  });
  $scope.openLogin = function() {
    $scope.login.show();
  };
  $scope.$on('$destroy', function() {
    $scope.login.remove();
  });

});
