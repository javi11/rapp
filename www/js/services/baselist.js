/*global services*/

'use strict';
/**
 * BaseList service
 * @module BaseList
 */
services.factory('BaseList', function($resource) {

  var Bases = {
    call: $resource('https://docs.google.com/uc?export=download&id=0B81Cf13ty16VVThSSXlnN2l0Wlk', {}, {
      get: {
        isArray: true,
        method: 'get',
        cache: true,
        transformResponse: function(data) {
          return JSON.parse(data);
        }
      }
    }),
    downloadBase : function() {

    }
  };
  return Bases;
});
