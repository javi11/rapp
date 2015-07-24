/* global controllers */

'use strict';

controllers
  .controller('LoginCtrl',
    function($scope, $state, $ionicLoading, Auth, User, $ionicPopup) {
      $scope.user = {
        email: '',
        password: ''
      };

      $scope.login = function() {

        $ionicLoading.show({
          template: 'Entrado...'
        });

        Auth.login($scope.user.email, $scope.user.password)
          .then(User.loadCurrentUser)
          .then(redirectBasedOnStatus)
          .catch(handleError);
      };

      function redirectBasedOnStatus() {
        $ionicLoading.hide();

        if (User.hasChangedPassword()) {
          $state.go('app.home');
        } else {
          $state.go('change-password');
        }
      }

      function handleError(error) {
        var errorMessage;
        switch (error.code) {
          case 'INVALID_EMAIL':
          case 'INVALID_PASSWORD':
          case 'INVALID_USER':
            errorMessage = 'Email o contraseña incorrecto.';
            break;
          default:
            errorMessage = 'Error: [' + error.code + ']';
        }
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Error!',
          template: errorMessage
        });
        alertPopup.then(function() {
          localStorage.setItem('notFirstTime', true);
        });
      }
    });
