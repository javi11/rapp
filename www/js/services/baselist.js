/*global services, saveObject, deleteObject, cordova*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services.factory('BaseList', function($cordovaMedia, APPDIR, AudioSvc) {

  var playing = false;

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
    AudioSvc.playAudio(cordova.file.externalRootDirectory + APPDIR + base.path + base.song, function(a) {
      playing = true;
      if (a < 0) {
        pauseBase();
      }
    });
  }

  function pauseBase() {
    // Play audio
    if (playing) {
      AudioSvc.pauseAudio();
      playing = false;
    }
  }

  return {
    getAll: getList,
    save: saveBase,
    'delete': deleteBase,
    play: playBase,
    pause: pauseBase
  };
});
