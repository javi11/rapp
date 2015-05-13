/*global cordova, StatusBar */
/*exported services */

'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'config', 'starter.controllers', 'starter.services']);

/**
 * Module of services.
 * @property services
 */
var services = angular.module('starter.services', []);


app.run(function($ionicPlatform, $cordovaFile, APPDIR) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //Create app directory
      var rootDir = $cordovaFile.createDir(cordova.file.externalRootDirectory, APPDIR, false),
        rapDir = $cordovaFile.createDir(cordova.file.externalRootDirectory, APPDIR + '/rap', false),
        basesDir = $cordovaFile.createDir(cordova.file.externalRootDirectory, APPDIR + '/bases', false),
        tempDir = $cordovaFile.createDir(cordova.file.externalRootDirectory, APPDIR + '/tmp', false);


      rootDir
        .then(rapDir)
        .then(tempDir)
        .finally(basesDir);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.bases', {
    url: '/bases',
    views: {
      'menuContent': {
        templateUrl: 'templates/bases.html',
        controller: 'BasesCtrl'
      }
    }
  })

  .state('app.raps', {
    url: '/raps',
    views: {
      'menuContent': {
        templateUrl: 'templates/raps.html',
        controller: 'RapsCtrl'
      }
    }
  })

  .state('app.base', {
    url: '/bases/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/editor.html',
        controller: 'BasesCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
