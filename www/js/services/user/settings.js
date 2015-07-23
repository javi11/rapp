/*global services, cordova*/

'use strict';
/**
 * Settings service
 * @module Settings
 */
services
  .factory('Settings', function($indexedDB,$q) {

    var Settings = {
      get: function(id) {
        var deferred = $q.defer();
        return deferred.promise;
      }
    };
    return Settings;
  });
