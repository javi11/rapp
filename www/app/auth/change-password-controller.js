/* global controllers */

'use strict';

controllers
  .controller('ChangePasswordCtrl',
    function($scope, $state, $ionicLoading, Auth, User, $ionicPopup) {
      var passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

      $scope.user = {
        oldPassword: '',
        newPassword: ''
      };
      $scope.passwordValid = true;
      $scope.errorMessage = null;

      $scope.isFirstPasswordChange = !User.hasChangedPassword();

      if ($scope.isFirstPasswordChange) {
        $scope.passwordLabel = 'Contraseña temporal';
        $scope.passwordPlaceholder = 'La encontrarás en el email que te enviamos.';
      } else {
        $scope.passwordLabel = 'Contraseña actual';
        $scope.passwordPlaceholder = 'Tu contraseña actual';
      }

      $scope.done = function() {
        $scope.passwordValid = passwordStrengthRegex.test($scope.user.newPassword);

        if (!$scope.passwordValid) {
          return;
        }

        $scope.errorMessage = null;

        $ionicLoading.show({
          template: 'Espere, por favor...'
        });

        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(User.recordPasswordChange)
          .then(goToDashboard)
          .catch(handleError);
      };

      function goToDashboard() {
        $ionicLoading.hide();
        $state.go('home');
      }

      function handleError(error) {
        var errorMessage = null;
        switch (error.code) {
          case 'INVALID_PASSWORD':
            errorMessage = 'Contraseña incorrecta';
            break;
          default:
            errorMessage = 'Error: [' + error.code + ']';
        }

        $ionicLoading.hide();
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          cssClass: 'error',
          title: 'Error!',
          template: errorMessage
        });
        alertPopup.then(function() {});
      }
    });
