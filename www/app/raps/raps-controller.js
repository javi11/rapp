/* global controllers */
'use strict';

controllers
  .controller('RapsCtrl', function($ionicPlatform, $scope, $rootScope, Raps, $ionicModal, APPDIR, AudioSvc, $cordovaFile, $ionicPopup) {

    var user;

    function fail(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Alerta!',
        cssClass: 'error',
        template: 'Se produjo un error al intentar realizar esta acción.'
      });
      alertPopup.then(function() {
        console.log('Error');
        console.log(JSON.stringify(err));
      });
    }

    function getRapList() {
      Raps.getAll(user).then(function(list) {
        $scope.raps = list;
      }, fail);
    }

    $scope.raps = [];
    $scope.selected = null;

    $ionicModal.fromTemplateUrl('app/utils/player.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    getRapList();

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
        AudioSvc.loadAudio($rootScope.appDir + APPDIR + '/rap/' + $scope.selected.name + '.mp3');
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
      Raps.updateRaps($scope.raps);
    };

    $scope.onItemDelete = function($index) {
      var item = $scope.raps[$index];
      var confirmPopup = $ionicPopup.confirm({
        title: 'Eliminar ' + item.name,
        template: '¿Estás seguro que quieres borrarlo?',
        buttons: [{
          text: 'No',
          type: 'button-assertive',
          onTap: function() {
            return false;
          }
        }, {
          text: '<b>Sí</b>',
          onTap: function() {
            return true;
          }
        }]
      });
      confirmPopup.then(function(res) {
        if (res) {
          $cordovaFile.removeFile($rootScope.appDir + APPDIR + '/rap/', item.name + '.mp3').then(function() {
            Raps.delete($scope.raps, $index).then(function() {}, fail);
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

    $scope.$on('addRap', getRapList);

  });
