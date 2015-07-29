/*global services, Firebase*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services
  .factory('Bases', function(FBURL, $resource, $indexedDB, $cordovaFileTransfer, $cordovaFile, APPDIR, $q, $firebaseArray, $cordovaNetwork, $rootScope) {

    var Bases = {
      downloaded: function(base, index) {
        var deferred = $q.defer();
        $cordovaFile.checkFile($rootScope.appDir + APPDIR + '/bases/' + base.path + '/', base.title + '.mp3')
          .then(function() {
            return deferred.resolve({
              success: true,
              index: index
            });
          }, function() {
            return deferred.resolve({
              success: false,
              index: index
            });
          });
        return deferred.promise;
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
        if (($cordovaNetwork.isOnline())) {
          var targetPath = $rootScope.appDir + APPDIR + '/bases/' + base.path + '/' + base.title + '.mp3',
            coverPath = $rootScope.appDir + APPDIR + '/bases/' + base.path + '/cover.jpg',
            trustHosts = true,
            options = {},
            chekBasesDir = $cordovaFile.checkDir($rootScope.appDir, APPDIR + '/bases'),
            createbasesDir = $cordovaFile.createDir($rootScope.appDir, APPDIR + '/bases', false),
            chekBaseDir = $cordovaFile.checkDir($rootScope.appDir, APPDIR + '/bases/' + base.path),
            createbaseDir = $cordovaFile.createDir($rootScope.appDir, APPDIR + '/bases/' + base.path, false),
            downloadBase = $cordovaFileTransfer.download(base.song, targetPath, options, trustHosts),
            downloadCover = $cordovaFileTransfer.download(base.cover, coverPath, options, trustHosts);

          chekBasesDir
            .then(chekBaseDir, function() {
              return createbasesDir;
            })
            .then(downloadBase, function() {
              return createbaseDir;
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
