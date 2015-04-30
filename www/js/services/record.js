/*global services, cordova, randomString*/

'use strict';
/**
 * Record service
 * @module record
 */
services.factory('$record', function($cordovaMedia, $cordovaFile, APPDIR, RapList) {

  var recordName = 'rap-temp-' + randomString(5, 'A') + '.mp3';
  var mediaRec = null;

  /**
   * Start a record
   *
   * @method startRecord
   */

  function startRecord() {
    recordName = 'rap-temp-' + randomString(5, 'A') + '.mp3';
    mediaRec = $cordovaMedia.newMedia(cordova.file.externalRootDirectory + APPDIR + '/tmp/' + recordName);
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
    console.log(JSON.stringify(err));
  }

  function clearTmp(done) {
    $cordovaFile.removeFile(cordova.file.externalRootDirectory + APPDIR + '/tmp/', recordName).then(done, fail);
  }

  /**
   * Save the recorded file to the server
   *
   * @method save
   */

  function save(data, done) {
    data.path = APPDIR + '/rap';
    RapList.save(data, function(err) {
      if (err) {
        return done(err);
      }
      $cordovaFile.moveFile(cordova.file.externalRootDirectory + APPDIR + '/tmp/', recordName, cordova.file.externalRootDirectory + '/' + APPDIR + '/rap', data.name + '.mp3')
        .then(function() {
          done();
        }, fail);
    });
  }

  return {
    start: startRecord,
    stop: stopRecord,
    name: getRecord,
    getMedia: mediaRec,
    save: save,
    clearTmp: clearTmp
  };
});
