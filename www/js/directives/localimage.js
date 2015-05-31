/* global app, cordova */
'use strict';
app.directive('localImage', function($cordovaFile, $ionicPlatform) {
  return function(scope, element, attrs) {
    attrs.$observe('localImage', function(value) {
      $ionicPlatform.ready(function() {
        var filename = value.replace(/^.*[\\\/]/, '');
        var path = value.replace(/[^\/]*$/, '');
        $cordovaFile.readAsDataURL(cordova.file.externalRootDirectory + path, filename).then(function(success) {
          // success
          element[0].src = success;
        }, function(error) {
          if (error.code !== 1 && error.code !== 0) {
            console.log(JSON.stringify(error));
          }
        });
      });
    });
  };
});
