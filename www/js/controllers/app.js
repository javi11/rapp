/* global app */
'use strict';

app.controller('AppCtrl', function($scope) {
  $scope.menu = [{
    name: 'Practica Solo',
    href: '#/app/bases',
    description: 'Entrena antes de la battalla, para ponerte a punto.',
    background: 'alone'
  }, {
    name: 'Batalla',
    href: '#/',
    description: 'Entra en el ring y demuestra tus habilidades a todo el mundo.',
    background: 'battle'
  }];
});
