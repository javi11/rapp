/* global app */
'use strict';
app.directive('AudioPlayer', function($record, $ionicPlatform) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      title: '=title',
      description:'=description',
      cover:'=cover'
    },
    templateUrl: 'views/player/player.html',
    link: function(scope) {
      $ionicPlatform.ready(function() {
        scope.playBtn = true;
        scope.elapse = $record;
        scope.duration = $record.getDuration();
        $record.getMedia.addEventListener('timeupdate',function (){
          scope.elapse = parseInt($record.getMedia.currentTime, 10);
        });
        scope.play = function() {
          $record.play();
        };
        scope.pause = function() {
          $record.pause();
        };
      });
    }
  };
});
