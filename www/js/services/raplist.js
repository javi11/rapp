/*global services, saveObject, deleteObject*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services.factory('RapList', function() {

  function getList(callback) {
    if (localStorage.myRaps) {
      callback(null, JSON.parse(localStorage.getItem('myRaps')));
    } else {
      callback('No hay raps.', []);
    }
  }

  function saveRap(rap, callback) {
    saveObject('myRaps', rap);
    callback();
  }

  function deleteRap(rap, callback) {
    deleteObject('myRaps', rap);
    callback();
  }

  return {
    getAll: getList,
    save: saveRap,
    'delete' : deleteRap
  };
});
