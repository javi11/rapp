/*exported randomString */
/*jshint bitwise: false*/

'use strict';

function randomString(length) {
  var arr = new Uint8Array((length || 40) / 2);
  window.crypto.getRandomValues(arr);
  return [].map.call(arr, function(n) { return n.toString(16); }).join('');
}
