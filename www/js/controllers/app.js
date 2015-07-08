/* global app */
'use strict';

app.controller('AppCtrl', function($scope) {
  $scope.menu = [{
    name: 'Practica Solo',
    href: '#/app/bases',
    background: 'img/alone.jpg',
    mp4: 'img/alone.mp4'
  }, {
    name: 'Batalla',
    href: '#/',
    background: 'img/battle.jpg',
    mp4: 'img/battle.mp4'
  }];
});
