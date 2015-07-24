/*global services*/

/*jshint bitwise: false*/

'use strict';
/**
 * Utils service
 * @module Utils
 */
services.factory('Utils', function() {
  var Utils = {

    randomString : function(length) {
      var arr = new Uint8Array((length || 40) / 2);
      window.crypto.getRandomValues(arr);
      return [].map.call(arr, function(n) {
        return n.toString(16);
      }).join('');
    }

  };

  return Utils;
});
