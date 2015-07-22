'use strict';

/* Directives */


angular.module('starter')
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm) {
      elm.text(version);
    };
  }]);
