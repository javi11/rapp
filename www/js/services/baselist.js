/*global services, saveObject, deleteObject, cordova*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services.factory('BaseList', function($cordovaMedia, APPDIR) {

  var playing = null;

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

  function playBase(base) {
    console.log(cordova.file.externalRootDirectory + APPDIR + base.path + base.song);
    playing = $cordovaMedia.newMedia(cordova.file.externalRootDirectory + APPDIR + base.path + base.song);
    // Play audio
    playing.media.play();
  }

  function pauseBase() {
    // Play audio
    playing.media.pause();
  }

  return {
    getAll: getList,
    save: saveBase,
    'delete': deleteBase,
    play: playBase,
    pause: pauseBase
  };
});
