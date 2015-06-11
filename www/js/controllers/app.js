/* global app */
'use strict';

app.controller('AppCtrl', function($scope) {
  $scope.menu = [{
    name: 'Practica Solo',
    href: '#/app/bases',
    icon: 'icon-solo'
  }, {
    name: 'Batalla',
    href: '#/',
    icon: 'icon-batalla'
  }, {
    name: 'Palabras',
    href: '#/',
    icon: 'icon-palabras'
  }, {
    name: 'Rap\'s',
    href: '#/app/raps',
    icon: 'icon-raps'
  }];
});
