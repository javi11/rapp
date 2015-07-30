/* global controllers */

'use strict';

controllers
  .controller('ResetPasswordCtrl',
    function($scope, $ionicLoading, Auth, $ionicPopup, $timeout, $state) {
      $scope.user = {
        email: ''
      };

      $scope.resetPassword = function() {
        $scope.errorMessage = null;

        $ionicLoading.show({
          template: 'Espere por favor...'
        });
        if (!$scope.user.email) {
          return handleError({
            code: 'INVALID_EMAIL'
          });
        }
        Auth.sendPasswordResetEmail($scope.user.email)
          .then(showConfirmation)
          .catch(handleError);
      };

      function showConfirmation() {
        $scope.emailSent = true;
        $ionicLoading.hide();
        $state.go('login');
        var okPopup = $ionicPopup.show({
          title: 'OK!',
          template: 'Se ha enviado un email a su correo con los pasos para recuperar su contraseña.'
        });
        $timeout(function() {
          okPopup.close();
        }, 3000);
      }

      function handleError(error) {
        var errorMessage = null;
        switch (error.code) {
          case 'INVALID_EMAIL':
          case 'INVALID_USER':
            errorMessage = 'Email incorrecto';
            break;
          default:
            errorMessage = 'Error: [' + error.code + ']';
        }

        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          cssClass: 'error',
          title: 'Error!',
          template: errorMessage
        });
        alertPopup.then(function() {});
      }
    });
