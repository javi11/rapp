/*global services, randomString*/

'use strict';
/**
 * RapList service
 * @module RapList
 */
services.factory('RapList', function($indexedDB, $q) {
  var RapList = {
    getAll: function() {
      var deferred = $q.defer();
      $indexedDB.openStore('raps', function(store) {
        store.getAll().then(function(bases) {
          deferred.resolve(bases);
        }, function(e) {
          deferred.reject(e);
        });
      });
      return deferred.promise;
    },

    update: function(raps) {
      var deferred = $q.defer();
      $indexedDB.openStore('raps', function(store) {
        store.upsert(raps).then(function() {
          deferred.resolve();
        }, function(e) {
          deferred.reject(e);
        });
      });
      return deferred.promise;
    },

    save: function(rap) {
      var deferred = $q.defer();
      $indexedDB.openStore('raps', function(store) {
        rap._id = randomString(32);
        store.insert(rap).then(function() {
          deferred.resolve();
        }, function(e) {
          deferred.reject(e);
        });
      });
      return deferred.promise;
    },

    delete: function(rap) {
      var deferred = $q.defer();
      $indexedDB.openStore('raps', function(store) {
        store.delete(rap._id).then(function() {
          deferred.resolve();
        }, function(e) {
          deferred.reject(e);
        });
      });
      return deferred.promise;
    }
  };

  return RapList;
});
