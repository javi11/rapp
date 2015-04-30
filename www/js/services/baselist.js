/*global services, saveObject, deleteObject*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services.factory('BaseList', function() {

  function getList(callback) {
    if (localStorage.bases) {
      callback(null, JSON.parse(localStorage.getItem('bases')));
    } else {
      callback('No hay raps.', []);
    }
  }

  function saveBase(base, callback) {
    saveObject('bases', base);
    callback();
  }

  function deleteBase(base, callback) {
    deleteObject('bases', base);
    callback();
  }

  return {
    getAll: getList,
    save: saveBase,
    'delete': deleteBase
  };
});
