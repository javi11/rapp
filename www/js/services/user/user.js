/*global services, Firebase*/

'use strict';

services
  .service('User',
    function($q, $firebaseObject, FBURL, Auth) {
      var usersRef = new Firebase(FBURL + '/users');
      var currentUser = null;

      this.loadCurrentUser = function() {
        var currentUserRef = usersRef.child(Auth.currentUser.uid);
        currentUser = $firebaseObject(currentUserRef);

        return currentUser.$loaded();
      };

      this.create = function(id, email) {
        var users = $firebaseObject(usersRef);

        return users.$child(id).$set({
          email: email
        });
      };

      this.recordPasswordChange = function() {
        var now = Math.floor(Date.now() / 1000);

        return currentUser.$update({
          passwordLastChangedAt: now
        });
      };

      this.hasChangedPassword = function() {
        return angular.isDefined(currentUser.passwordLastChangedAt);
      };
    });
