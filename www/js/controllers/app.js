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
    description: 'Sube a la tarima y demuestra tus habilidades a todo el mundo.',
    background: 'battle'
  }];

  $ionicModal.fromTemplateUrl('templates/user/settings.html', {
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

});
