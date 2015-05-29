/*global services, randomString*/

'use strict';
/**
 * RapList service
 * @module RapList
 */
services.factory('RapList', function($indexedDB, $q) {

  function getList() {
    var deferred = $q.defer();
    $indexedDB.openStore('raps', function(store) {
      store.getAll().then(function(bases) {
        deferred.resolve(bases);
      }, function(e) {
        deferred.reject(e);
      });
    });
    return deferred.promise;
  }

  function updateRap(raps) {
    var deferred = $q.defer();
    $indexedDB.openStore('raps', function(store) {
      store.upsert(raps).then(function() {
        deferred.resolve();
      }, function(e) {
        deferred.reject(e);
      });
    });
    return deferred.promise;
  }

  function saveRap(rap) {
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
  }

  function deleteRap(rap) {
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

  return {
    getAll: getList,
    save: saveRap,
    'delete': deleteRap,
    update: updateRap
  };
});
