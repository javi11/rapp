/* global controllers */

'use strict';

controllers
  .controller('SignupCtrl',
    function($scope, $q, $state, $ionicLoading, Auth, User, Signup, $ionicPopup) {
      var password = Signup.randomPassword();

      $scope.user = {
        email: ''
      };
      $scope.errorMessage = null;

      $scope.signup = function() {
        $scope.errorMessage = null;

        $ionicLoading.show({
          template: 'Espere, por favor...'
        });

        createAuthUser().then(sendPasswordResetEmail)
          .then(login)
          .then(createMyAppUser)
          .then(goToChangePassword)
          .catch(handleError);
      };

      function createAuthUser() {
        return Auth.createUser($scope.user.email, password);
      }

      function sendPasswordResetEmail() {
        var defer = $q.defer();
        Auth.sendPasswordResetEmail($scope.user.email).then(function() {
          defer.resolve($scope.user.email);
        });

        return defer.promise;
      }

      function login(email) {
        return Auth.login(email, password);
      }

      function createMyAppUser(authUser) {
        return User.create(authUser.uid, authUser.password.email);
      }

      function goToChangePassword() {
        $ionicLoading.hide();
        $state.go('change-password');
      }

      function handleError(error) {
        var errorMessage;
        switch (error.code) {
          case 'INVALID_EMAIL':
            errorMessage = 'Email incorrecto.';
            break;
          case 'EMAIL_TAKEN':
            errorMessage = 'Este email ya existe.';
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
