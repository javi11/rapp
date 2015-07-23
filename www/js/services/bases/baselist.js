/*global services, cordova, Firebase*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services
  .factory('BaseList', function(FBURL, $resource, $indexedDB, $cordovaFileTransfer, $cordovaFile, APPDIR, $q, $firebaseArray, $cordovaNetwork) {

    var Bases = {
      downloaded: function(base) {
        return $cordovaFile.checkFile(cordova.file.externalRootDirectory + APPDIR + '/bases/' + base.path + '/', base.title + '.mp3');
      },
      getAll: function() {
        var basesRef = new Firebase(FBURL + '/bases');
        return $firebaseArray(basesRef);
      },
      get: function(base) {
        var basesRef = new Firebase(FBURL + '/bases/' + base);
        return basesRef;
      },
      download: function(base) {
        var deferred = $q.defer();
        if ($cordovaNetwork.isOnline()) {
          var targetPath = cordova.file.externalRootDirectory + APPDIR + '/bases/' + base.path + '/' + base.title + '.mp3',
            coverPath = cordova.file.externalRootDirectory + APPDIR + '/bases/' + base.path + '/cover.jpg',
            trustHosts = true,
            options = {},
            baseDir = $cordovaFile.createDir(cordova.file.externalRootDirectory, APPDIR, false),
            downloadBase = $cordovaFileTransfer.download(base.song, targetPath, options, trustHosts),
            downloadCover = $cordovaFileTransfer.download(base.cover, coverPath, options, trustHosts);

          baseDir
            .then(downloadBase, function(error) {
              deferred.reject(error);
            })
            .then(downloadCover, function(error) {
              deferred.reject(error);
            })
            .then(function() {
              deferred.resolve({
                data: base,
                status: true
              });
            }, function(error) {
              deferred.reject(error);
            });
        } else {
          deferred.resolve({
            data: null,
            status: false
          });
        }
        return deferred.promise;
      }
    };
    return Bases;
  });
