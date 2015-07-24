'use strict';
angular.module('config', [])
  .constant('APPNAME', 'Rapp')
  .constant('APPDB', 'db.rapp')
  .constant('APPDIR', 'rapp')
  .constant('FBURL', 'https://rapp-api.firebaseio.com')
  // double check that the app has been configured before running it and blowing up space and time
  .run(['FBURL', '$timeout', function(FBURL, $timeout) {
    if (FBURL.match('//INSTANCE.firebaseio.com')) {
      angular.element(document.body).html('<h1>Please configure app/config.js before running!</h1>');
      $timeout(function() {
        angular.element(document.body).removeClass('hide');
      }, 250);
    }
  }]);
