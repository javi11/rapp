/*global services, cordova, db*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services
  .factory('BaseList', function($resource, $cordovaSQLite, $cordovaFileTransfer, $cordovaFile, APPDIR) {

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
        var targetPath = cordova.file.externalRootDirectory + APPDIR + '/bases/' + base.path + '/' + base.title + '.mp3',
          coverPath = cordova.file.externalRootDirectory + APPDIR + '/bases/' + base.path + '/cover.jpg',
          trustHosts = true,
          options = {},
          query = 'INSERT INTO bases (id, title, path, song, downloaded) VALUES (' + base.id + ',\'' + base.title + '\',\'/bases/' + base.path + '\',\'' + base.title + '.mp3\', true)',
          baseDir = $cordovaFile.createDir(cordova.file.externalRootDirectory, APPDIR, false),
          downloadBase = $cordovaFileTransfer.download(base.song, targetPath, options, trustHosts),
          downloadCover = $cordovaFileTransfer.download(base.cover, coverPath, options, trustHosts),
          addToDB = $cordovaSQLite.execute(db, query, ['test', 100]);

        return baseDir
          .then(downloadBase)
          .then(downloadCover)
          .then(addToDB);
      },
      getDownloadedBases: function() {
        var query = 'SELECT id FROM bases';
        return $cordovaSQLite.execute(db, query, []);
      }
    };
    return Bases;
  });
