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
        var userRef = new Firebase(FBURL + '/users/' + id);
        var user = $firebaseObject(userRef);
        user.email = email;
        return user.$save();
      };

      this.recordPasswordChange = function() {
        var now = Math.floor(Date.now() / 1000);
        currentUser.passwordLastChangedAt = now;
        return currentUser.$save();
      };

      this.hasChangedPassword = function() {
        return angular.isDefined(currentUser.passwordLastChangedAt);
      };
    });
