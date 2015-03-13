/*global services, LocalFileSystem*/

'use strict';
/**
 * Record service
 * @module record
 */
services.factory('$record', function($cordovaMedia) {

  var enumerator = 0;
  var recordName = 'record-' + enumerator + '.mp3';
  var mediaRec = null;
  var OnCallback = null;
  var OnAppendData = {};

  /**
   * Start a record
   *
   * @method startRecord
   */

  function startRecord() {
    enumerator++;
    recordName = 'record-' + enumerator + '.mp3';
    mediaRec = $cordovaMedia.newMedia(recordName).then(function() {
      // success
    }, function() {
      // error
    });
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
   * Save the recorded file to the server
   *
   * @method save
   */

  function save(callback, appendData) {
    OnCallback = callback;
    OnAppendData = appendData;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, OnFileSystem, fail);
  }

  /**
   * Callback for setting the file system to persistent.
   *
   * @method OnFileSystem
   */

  function OnFileSystem(fileSystem) {
    fileSystem.root.getFile(recordName, {
      create: true,
      exclusive: false
    }, OnGetFile, fail);
  }

  /**
   * Callback for geting the file for disk
   *
   * @method OnGetFile
   */

  function OnGetFile(fileEntry) {
      console.log('File ' + recordName + ' created at ' + fileEntry.fullPath);
      mediaRec = $cordovaMedia.newMedia(fileEntry.fullPath).then(function() {
        // success
      }, function() {
        // error
      });
    }
    /**
     * When any process of saving file fail, this console the error.
     *
     * @method OnFileEntry
     */

  function fail(err) {
    console.log('Error');
    console.log(err);
  }

  /**
   * Play record
   *
   * @method playRecord
   */

  function playRecord() {
    var mediaFile = $cordovaMedia.newMedia(recordName).then(function() {
      // success
    }, function() {
      // error
    });
    // Play audio
    mediaFile.play();
  }

  return {
    start: startRecord,
    stop: stopRecord,
    play: playRecord,
    name: getRecord,
    save: save
  };
});
