/*global services, cordova*/

'use strict';
/**
 * Record service
 * @module record
 */
services.factory('$record', function($cordovaMedia, $cordovaFile, APPDIR, Raps, $q, Utils, $rootScope) {

  var recordName = 'rap-temp-' + Utils.randomString(5) + '.mp3';
  var mediaRec = null;

  /**
   * Start a record
   *
   * @method startRecord
   */

  function startRecord() {
    recordName = 'rap-temp-' + Utils.randomString(5) + '.mp3';
    mediaRec = $cordovaMedia.newMedia($rootScope.appDir + APPDIR + '/tmp/' + recordName);
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
    console.log(JSON.stringify(err));
  }

  function clearTmp(done) {
    $cordovaFile.removeFile($rootScope.appDir + APPDIR + '/tmp/', recordName).then(done, fail);
  }

  /**
   * Save the recorded file to the server
   *
   * @method save
   */

  function save(user, data) {
    var deferred = $q.defer();
    data.path = APPDIR + '/rap';
    data.creationDate = new Date();
    Raps.add(user, data).then(function() {
      $cordovaFile.moveFile($rootScope.appDir + APPDIR + '/tmp/', recordName, $rootScope.appDir + '/' + APPDIR + '/rap', data.name + '.mp3')
        .then(function() {
          deferred.resolve();
        }, fail);
    }, function(error) {
      deferred.reject(error);
    });
    return deferred.promise;
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
