/*global services, cordova, randomString*/

'use strict';
/**
 * Record service
 * @module record
 */
services.factory('$record', function($cordovaMedia, $cordovaFile, APPDIR, RapList, $q) {

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
   * Get record current position
   *
   * @method getCurrentPosition
   */

  function getCurrentPosition() {
    var q = $q.defer();

    mediaRec.getCurrentPosition(function(success) {
      q.resolve(success);

    }, function(error) {
      q.reject(error);
    });

    return q.promise;
  }

  /**
   * Get record duration
   *
   * @method getDuration
   */

  function getDuration() {

    return mediaRec.getDuration();
  }


  /**
   * Seek to in milliseconds
   *
   * @method seekTo
   */

  function seekTo(milliseconds) {

    return mediaRec.seekTo(milliseconds);
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
   * Set the volumen
   *
   * @method setVolume
   */

  function setVolume(volume) {
    return mediaRec.setVolume(volume);
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
    setVolume: setVolume,
    getDuration: getDuration,
    getCurrentPosition: getCurrentPosition,
    seekTo: seekTo,
    name: getRecord,
    getMedia : mediaRec,
    save: save
  };
});
