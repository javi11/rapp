/*global services, cordova, randomString*/

'use strict';
/**
 * Record service
 * @module record
 */
services.factory('$record', function($cordovaMedia, $cordovaFile, APPDIR, RapList) {

  var recordName = 'rap-temp-' + randomString(5, 'A') + '.mp3';
  var mediaRec = null;
  var mediaPlayed = null;
  var OnCallback = null;
  var OnAppendData = {};

  /**
   * Start a record
   *
   * @method startRecord
   */

  function startRecord() {
    recordName = 'rap-temp-' + randomString(5, 'A') + '.mp3';
    mediaRec = $cordovaMedia.newMedia(recordName);
    mediaRec = mediaRec.media;
    mediaRec.startRecord();
  }

  /**
   * Stop record
   *
   * @method stopRecord
   */

  function stopRecord() {
    mediaRec.stopRecord();
  }

  /**
   * Get the name of the record
   *
   * @method getRecord
   */

  function getRecord() {
    return recordName;
  }


  /**
   * When any process of saving file fail, this console the error.
   *
   * @method Fail
   */
  function fail(err) {
    console.log('Error');
    console.log(err);
  }


  /**
   * Save the recorded file to the server
   *
   * @method save
   */

  function save(callback, appendData) {
    OnCallback = callback;
    OnAppendData = appendData;
    OnAppendData.path = APPDIR + '/rap';
    RapList.save(OnAppendData, function() {
      $cordovaFile.moveFile(cordova.file.externalRootDirectory, recordName, cordova.file.externalRootDirectory + '/' + APPDIR + '/rap', appendData.name + '.mp3')
        .then(OnCallback, fail);
    });

  }

  /**
   * Play record
   *
   * @method playRecord
   */

  function playRecord() {
    mediaPlayed = $cordovaMedia.newMedia(recordName);
    // Play audio
    mediaPlayed.media.play();
  }

  /**
   * Play record
   *
   * @method playRecord
   */

  function pauseRecord() {
    // Play audio
    mediaPlayed.media.pause();
  }


  return {
    start: startRecord,
    stop: stopRecord,
    play: playRecord,
    pause: pauseRecord,
    name: getRecord,
    save: save
  };
});
