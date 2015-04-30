/* global app, cordova */
'use strict';

app.controller('RapsCtrl', function($ionicPlatform, $scope, $rootScope, RapList, $ionicModal, APPDIR, AudioSvc, $cordovaFile, $ionicPopup) {

  function fail(err) {
    console.log('Error');
    console.log(JSON.stringify(err));
  }

  $scope.raps = [];
  $scope.selected = null;

  $ionicModal.fromTemplateUrl('templates/player/player.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  RapList.getAll(function(err, list) {
    $scope.raps = list;
  });

  $rootScope.player = function() {
    $scope.modal.show();
    $ionicPlatform.ready(function() {
      $scope.pauseAudio = function() {
        AudioSvc.pauseAudio();
        $scope.isPlaying = false;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      };
      $scope.resumeAudio = function() {
        $scope.isPlaying = true;
        AudioSvc.playAudio(function(a, b) {
          $scope.position = Math.ceil(a / b * 100);
          if (a < 0) {
            $scope.stopAudio();
          }
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };
      $scope.stopAudio = function() {
        AudioSvc.stopAudio();
        $scope.isPlaying = false;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      };
      AudioSvc.loadAudio(cordova.file.externalRootDirectory + APPDIR + '/rap/' + $scope.selected.name + '.mp3');
      $scope.loaded = true;
      $scope.name = $scope.selected.name;
      $scope.path = $scope.selected.name;
    });
  };

  $scope.data = {
    showDelete: false,
    edit: false
  };

  $scope.share = function(item) {
    console.log('Compartir: ' + item.id);
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.raps.splice(fromIndex, 1);
    $scope.raps.splice(toIndex, 0, item);
    RapList.update($scope.raps, function() {});
  };

  $scope.onItemDelete = function(item) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Eliminar ' + item.name,
      template: '¿Estás seguro que quieres borrarlo?',
      buttons: [{
        text: 'No',
        type: 'button-assertive'
      }, {
        text: '<b>Sí</b>'
      }]
    });
    confirmPopup.then(function(res) {
      if (res) {
        $cordovaFile.removeFile(cordova.file.externalRootDirectory + APPDIR + '/rap/', item.name + '.mp3').then(function() {
          RapList.delete(item, function() {
            $scope.raps.splice($scope.raps.indexOf(item), 1);
          });
        }, fail);
      }
    });

  };

  $scope.open = function(item) {
    $scope.selected = item;
    // show the player
    $rootScope.player();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.stopAudio();
  };

  $scope.$on(
    'addRap',
    function getRapList() {
      RapList.getAll(function(err, list) {
        $scope.raps = list;
      });
    }
  );

});
