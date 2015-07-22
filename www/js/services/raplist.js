/*global services,Firebase*/

'use strict';
/**
 * RapList service
 * @module RapList
 */
services.factory('RapList', function(APIURL, $indexedDB, $q, $firebaseArray) {
  var RapList = {

    getAll: function(user) {
      var rapsRef = new Firebase(APIURL + '/raps/' + user.$id);
      return $firebaseArray(rapsRef);
    },

    getPublic: function() {
      var rapsRef = new Firebase(APIURL + '/raps');
      return $firebaseArray(rapsRef);
    },

    getRap: function(user, rap) {
      var rapsRef = new Firebase(APIURL + '/raps/' + user.$id + '/' + rap.$id);
      return rapsRef;
    },

    updateRaps: function(raps) {
      return raps.$save();
    },

    add: function(user, rap) {
      var deferred = $q.defer();
      var raps = this.getAll(user);
      var load = raps.$loaded();
      var add = raps.$add(rap);
      load
        .then(add)
        .then(function(ref) {
          var id = ref.key();
          deferred.resolve(raps.$getRecord(id));
        });
      return deferred.promise;
    },

    update: function(raps, index) {
      return raps.$save(index);
    },

    delete: function(raps, index) {
      var item = raps[index];
      return raps.$remove(item);
    }
  };

  return RapList;
});
