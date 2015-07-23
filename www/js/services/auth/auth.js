/*global services, Firebase*/

'use strict';

services
  .service('Auth',
    function($q, FBURL, $firebaseAuth) {
      var self = this;
      var firebaseAuth = $firebaseAuth(new Firebase(FBURL));

      this.currentUser = null;

      this.getCurrentUser = function() {
        var defer = $q.defer();

        firebaseAuth.$onAuth(function(user) {
          self.currentUser = user;

          if (user === null) {
            defer.reject();
          } else {
            defer.resolve(user);
          }
        });

        return defer.promise;
      };

      this.createUser = function(email, password) {
        var defer = $q.defer();

        firebaseAuth.$createUser(email, password).then(
          function(user) {
            self.currentUser = user;
            defer.resolve(user);
          },
          function(error) {
            self.currentUser = null;
            defer.reject(error);
          });

        return defer.promise;
      };

      this.login = function(email, password) {
        var defer = $q.defer();

        firebaseAuth.$authWithPassword({
          email: email,
          password: password
        }).then(
          function(user) {
            self.currentUser = user;
            defer.resolve(user);
          },
          function(error) {
            self.currentUser = null;
            defer.reject(error);
          });

        return defer.promise;
      };

      this.logout = function() {
        firebaseAuth.$unauth();
        this.currentUser = null;
      };

      this.sendPasswordResetEmail = function(email) {
        return firebaseAuth.$resetPassword({
          email: email
        });
      };

      this.changePassword = function(oldPassword, newPassword) {
        return firebaseAuth.$changePassword(this.currentUser.email, oldPassword, newPassword);
      };
    });
