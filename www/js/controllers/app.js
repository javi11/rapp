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
  }, {
    name: 'Palabras',
    href: '#/',
    background: 'img/words.jpg',
    mp4: 'img/words.mp4'
  }, {
    name: 'Rap\'s',
    href: '#/app/raps',
    background: 'img/raps.jpg',
    mp4: 'img/raps.mp4'
  }];
});
