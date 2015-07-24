/*global cordova, StatusBar */
/*exported services, controllers */

'use strict';
// Ionic Rapp App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'rapp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('rapp', ['ionic', 'firebase', 'ionic.service.core', 'ngCordova', 'ngResource', 'indexedDB', 'config', 'rapp.controllers', 'rapp.services']);

/**
 * Module of controllers.
 * @property controllers
 */

var controllers = angular.module('rapp.controllers', []);

/**
 * Module of services.
 * @property services
 */

var services = angular.module('rapp.services', []);

app.run(function($ionicPlatform, $cordovaFile, APPDIR, Auth, $rootScope, $state) {
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
  $rootScope.$on('$stateChangeError', function(event, toState, toParams,
    fromState, fromParams, error) {
    console.log(error);
    $state.go(error);
  });
})

.config(function($stateProvider, $urlRouterProvider, $indexedDBProvider, $ionicAppProvider) {
  var resolve = {
    auth: function($q, $timeout, Auth, User) {
      var defer = $q.defer();
      var state = this;

      Auth.getCurrentUser().then(function() {
        User.loadCurrentUser().then(function() {
          if (state.name === 'change-password') {
            defer.resolve();
          } else {
            if (User.hasChangedPassword()) {
              defer.resolve();
            } else {
              defer.reject('change-password');
            }
          }
        });
      }, function() {
        $timeout(function() {
          defer.reject('login');
        }, 250);
      });

      return defer.promise;
    }
  };

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'app/home/menu.html',
      controller: 'AppCtrl'
    })

  .state('home', {
    url: '/home',
    templateUrl: 'app/home/home.html',
    controller: 'AppCtrl'
  })

  .state('app.bases', {
    url: '/bases',
    views: {
      'menuContent': {
        templateUrl: 'app/bases/bases.html',
        controller: 'BasesCtrl'
      }
    }
  })

  .state('app.raps', {
    url: '/raps',
    views: {
      'menuContent': {
        templateUrl: 'app/raps/raps.html',
        controller: 'RapsCtrl',
        resolve: resolve
      }
    }
  })

  .state('app.base', {
    url: '/bases/:id',
    views: {
      'menuContent': {
        templateUrl: 'app/bases/editor.html',
        controller: 'BasesCtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'app/auth/signup.html',
    controller: 'SignupCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'app/auth/login.html',
    controller: 'LoginCtrl'
  })

  .state('reset-password', {
    url: '/reset-password',
    templateUrl: 'app/auth/reset-password.html',
    controller: 'ResetPasswordCtrl'
  })

  .state('change-password', {
    url: '/change-password',
    templateUrl: 'app/auth/change-password.html',
    controller: 'ChangePasswordCtrl',
    resolve: resolve
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

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
      var Settings = db.createObjectStore('settings', {
        keyPath: '_id'
      });
      Settings.createIndex('_id_idx', '_id', {
        unique: true
      });
      Settings.createIndex('name_idx', 'name', {
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
