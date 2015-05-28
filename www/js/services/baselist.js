/*global services, cordova*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services
  .factory('BaseList', function($resource, $indexedDB, $cordovaFileTransfer, $cordovaFile, APPDIR, $q) {

    function randomString(length) {
      return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    var Bases = {
      call: $resource('https://rawgit.com/javi11/rapp/master/bases.json', {}, {
        get: {
          isArray: true,
          method: 'get',
          cache: true,
          transformResponse: function(data) {
            return JSON.parse(data).data;
          }
        }
      }),
      download: function(base) {
        var deferred = $q.defer();
        $indexedDB.openStore('bases', function(store) {
          var targetPath = cordova.file.externalRootDirectory + APPDIR + '/bases/' + base.path + '/' + base.title + '.mp3',
            coverPath = cordova.file.externalRootDirectory + APPDIR + '/bases/' + base.path + '/cover.jpg',
            trustHosts = true,
            options = {},
            baseDir = $cordovaFile.createDir(cordova.file.externalRootDirectory, APPDIR, false),
            downloadBase = $cordovaFileTransfer.download(base.song, targetPath, options, trustHosts),
            downloadCover = $cordovaFileTransfer.download(base.cover, coverPath, options, trustHosts),
            addToDB = store.insert({
              '_id': randomString(32),
              'id': base.id,
              'title': base.title,
              'path': '/bases/' + base.path + '/',
              'song': base.title + '.mp3',
              'downloaded': true
            });

          baseDir
            .then(downloadBase)
            .then(downloadCover)
            .then(addToDB)
            .then(function(e) {
              deferred.resolve(e);
            }, function(error) {
              deferred.resolve(error);
            });
        });
        return deferred.promise;
      },
      getDownloadedBases: function() {
        var deferred = $q.defer();
        $indexedDB.openStore('bases', function(store) {
          store.getAll().then(function(bases) {
            deferred.resolve({
              bases: bases
            });
          }, function(error) {
            deferred.resolve(error);
          });
        });
        return deferred.promise;
      },
      getBase: function(id) {
        var deferred = $q.defer();
        $indexedDB.openStore('bases', function(store) {
          store.findWhere(store.query().$index('id_idx').$eq(Number(id))).then(function(base) {
            deferred.resolve(base);
          }, function(error) {
            deferred.resolve(error);
          });
        });
        return deferred.promise;
      }
    };
    return Bases;
  });
