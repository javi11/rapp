/*global cordova, StatusBar */
/*exported services */

'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'ngResource', 'indexedDB', 'config', 'starter.controllers', 'starter.services']);

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

.config(function($stateProvider, $urlRouterProvider, $indexedDBProvider, $ionicAppProvider) {
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

  //Create database
  $indexedDBProvider
    .connection('myIndexedDB')
    .upgradeDatabase(1, function(event, db) {
      var Bases = db.createObjectStore('bases', {
        keyPath: '_id'
      });
      Bases.createIndex('id_idx', 'id', {
        unique: true
      });
      Bases.createIndex('title_idx', 'title', {
        unique: false
      });
      var Raps = db.createObjectStore('raps', {
        keyPath: '_id'
      });
      Raps.createIndex('_id_idx', '_id', {
        unique: true
      });
      Raps.createIndex('name_idx', 'name', {
        unique: true
      });
    });
  $ionicAppProvider.identify({
    // The App ID for the server
    'app_id': '25b5753c',
    // The API key all services will use for this app
    'api_key': 'b54e52509d43b0913638c9eae45c7aaa0e78408fa175e26'
      // Your GCM sender ID/project number (Uncomment if using GCM)
      //gcm_id: 'YOUR_GCM_ID'
  });
});
