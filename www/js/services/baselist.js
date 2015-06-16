/*global services, cordova, randomString*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services
  .factory('BaseList', function($resource, $indexedDB, $cordovaFileTransfer, $cordovaFile, APPDIR, $q, $cordovaNetwork) {

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
      sync: function() {
        var deferred = $q.defer(),
          me = this;
        if ($cordovaNetwork.isOnline()) {
          me.call.get().$promise.then(function(data) {
            deferred.resolve({
              data: data,
              sync: true
            });
          }, function(error) {
            deferred.reject(error);
          });
        } else {
          me.getBases(function(bases) {
            deferred.resolve({
              data: bases,
              sync: false
            });
          }, function(error) {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      },
      download: function(base) {
        var deferred = $q.defer();
        if ($cordovaNetwork.isOnline()) {
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
                'song': base.title + '.mp3'
              });

            baseDir
              .then(downloadBase, function(error) {
                deferred.reject(error);
              })
              .then(downloadCover, function(error) {
                deferred.reject(error);
              })
              .then(addToDB, function(error) {
                deferred.reject(error);
              })
              .then(function(e) {
                deferred.resolve({data: e, status: true});
              }, function(error) {
                deferred.reject(error);
              });
          });
        } else {
          deferred.resolve({data: null, status: false});
        }
        return deferred.promise;
      },
      getBases: function() {
        var deferred = $q.defer();
        $indexedDB.openStore('bases', function(store) {
          store.getAll().then(function(bases) {
            deferred.resolve(bases);
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
