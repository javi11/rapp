/* global app */
'use strict';

app.controller('AppCtrl', function($scope) {
  $scope.menu = [{
    name: 'Practica Solo',
    href: '#/app/bases',
    background: 'alone'
  }, {
    name: 'Batalla',
    href: '#/',
    background: 'battle'
  }, {
    name: 'Palabras',
    href: '#/',
    background: 'words'
  }, {
    name: 'Rap\'s',
    href: '#/app/raps',
    background: 'raps'
  }];
});
