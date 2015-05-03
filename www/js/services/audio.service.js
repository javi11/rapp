/*global Media, services*/
'use strict';

services.service('AudioSvc', [function() {

  var AudioSvc = {
    myMedia: null,
    mediaTimer: null,
    loadAudio: function(src) {
      var self = this;

      function onSuccess() {
        console.log('playAudio():Audio Success');
      }

      // onError Callback
      //
      function onError() {
          //console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');

          // we forcefully stop
        }
        // stop playing, if playing
      self.stopAudio();
      self.myMedia = new Media(src, onSuccess, onError);
    },

    playAudio: function(cb) {
      var self = this;
      if (self.myMedia) {
        self.myMedia.play();
        if (self.mediaTimer === null) {
          self.mediaTimer = setInterval(function() {
            self.myMedia.getCurrentPosition(
              function(position) {
                cb(position, self.myMedia.getDuration());
              },
              function(e) {
                console.log('Error getting pos=' + e);
              }
            );
          }, 1000);
        }
      }
    },
    getDuration: function() {
      var self = this;
      if (self.myMedia) {
        return self.myMedia.getDuration();
      }
    },
    seekTo: function(milliseconds) {
      var self = this;
      if (self.myMedia) {
        return self.myMedia.seekTo(milliseconds);
      }
    },
    pauseAudio: function() {
      var self = this;
      if (self.myMedia) {
        self.myMedia.pause();
      }
    },
    stopAudio: function() {
      var self = this;
      if (self.myMedia) {
        self.myMedia.stop();
      }
      if (self.mediaTimer) {
        clearInterval(self.mediaTimer);
        self.mediaTimer = null;
      }
    }

  };

  return AudioSvc;
}]);
