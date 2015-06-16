/* global app, cordova */
'use strict';

app.controller('BasesCtrl', function($ionicPlatform, $scope, $cordovaProgress, $ionicPopup, $rootScope, $record, $location, $ionicLoading, $ionicModal, $stateParams, BaseList, APPDIR, AudioSvc) {
  $scope.recording = false;
  $scope.APPDIR = APPDIR;
  $scope.record = {
    tags: [],
    text: '',
    name: ''
  };

  $scope.startRecordBtn = true;
  $scope.saveRecordBtn = false;
  $scope.playRecordBtn = false;
  $scope.playBaseBtn = true;

  $ionicModal.fromTemplateUrl('templates/records/save.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  function noNetwork() {
    var alertPopup = $ionicPopup.alert({
      title: 'Alerta!',
      template: 'Por favor, conectese a internet para obtener la lista más actualizada de bases o para descargar bases.'
    });
    alertPopup.then(function() {
      $location.path('#/app');
    });
  }

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

      AudioSvc.loadAudio(cordova.file.externalRootDirectory + APPDIR + '/tmp/' + $record.name());
      $scope.loaded = true;
      $scope.name = $record.name();
      $scope.path = $record.name();
    });
  };

  $rootScope.closeModal = function() {
    $scope.modal.hide();
    AudioSvc.loadAudio(cordova.file.externalRootDirectory + APPDIR + $scope.base.path + $scope.base.song);
  };

  function OnSaved(err) {
    $ionicLoading.hide();
    if (err) {
      $cordovaProgress.showText(false, 5000, err);
      return;
    }
    $scope.modal.hide();
    $scope.startRecordBtn = true;
    $scope.saveRecordBtn = false;
    $scope.playRecordBtn = false;
    $scope.$broadcast('addRap');
  }

  $scope.startRecord = function() {
    $scope.startRecordBtn = false;
    $record.start();
  };

  $scope.stopRecord = function() {
    $scope.startRecordBtn = true;
    $scope.playRecordBtn = true;
    $scope.playBaseBtn = true;
    $record.stop();
    AudioSvc.pauseAudio();
    // show the player
    $scope.player();
  };

  $scope.showSaveForm = function() {
    $scope.saveRecordBtn = true;
  };

  $scope.recordAgain = function() {
    $scope.modal.hide();
  };

  $scope.$on('modal.hidden', function() {
    $scope.startRecordBtn = true;
    $scope.playRecordBtn = false;
    $scope.saveRecordBtn = false;
    $record.clearTmp(function() {
      AudioSvc.loadAudio(cordova.file.externalRootDirectory + APPDIR + $scope.base.path + $scope.base.song);
    });
  });

  $scope.saveRecord = function() {
    $ionicLoading.show({
      template: 'Cargando.'
    });
    $record.save($scope.record).then(OnSaved, OnSaved);
  };

  $scope.goToBase = function(base) {
    if (base.downloaded) {
      $location.path('/app/bases/' + base.id);
    } else {
      var confirmPopup = $ionicPopup.confirm({
        title: base.title,
        template: 'No tienes esta base descargada, ¿Qiueres descargarla?',
        buttons: [{
          text: 'En otro momento',
          type: 'button-default',
          onTap: function() {
            return false;
          }
        }, {
          text: 'Descargar',
          type: 'button-dark',
          onTap: function() {
            return true;
          }
        }]
      });
      confirmPopup.then(function(res) {
        if (res) {
          $ionicLoading.show({
            template: 'Descargando base.'
          });
          BaseList.download(base).then(function(res) {
            if(!res.status) {
              noNetwork();
              $ionicLoading.hide();
              return;
            }
            var index = $scope.bases.indexOf(base);
            $scope.bases[index].downloaded = true;
            $ionicLoading.hide();
          }, function() {
            var index = $scope.bases.indexOf(base);
            $scope.bases[index].downloaded = true;
            $ionicLoading.hide();
          });
        }
      });
    }
  };
  $scope.playBase = function() {
    if ($stateParams.id) {
      $scope.playBaseBtn = false;
      $ionicPlatform.ready(function() {
        AudioSvc.playAudio(function(a, b) {
          $scope.position = Math.ceil(a / b * 100);
          if (a < 0) {
            $scope.pauseBase();
          }
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      });
    }
  };

  $scope.pauseBase = function() {
    AudioSvc.stopAudio();
    $scope.playBaseBtn = true;
  };

  $ionicPlatform.ready(function() {
    $ionicLoading.show({
      template: 'Cargando.'
    });
    if ($stateParams.id) {
      if (!localStorage.notFirstTime) {
        var alertPopup = $ionicPopup.alert({
          title: 'Alerta!',
          template: 'Si tiene los auriculares conectados, por favor desconectelos para añadir la base.'
        });
        alertPopup.then(function() {
          localStorage.setItem('notFirstTime', true);
        });
      }
      BaseList.getBase($stateParams.id).then(function(base) {
        $scope.base = base[0];
        AudioSvc.loadAudio(cordova.file.externalRootDirectory + APPDIR + $scope.base.path + $scope.base.song);
        $ionicLoading.hide();
      });
    } else {
      BaseList.sync().then(function(bases) {
        if (!bases.sync && bases.data.length > 0) {
            $scope.bases = bases.data;
            $scope.bases.map(function(base) {
              base.downloaded = true;
              return base;
            });
            $ionicLoading.hide();
        } else if (bases.data.length > 0) {
          $scope.bases = bases.data;
          BaseList.getBases().then(function(downloadedBases) {
            var basesId = downloadedBases.map(function(downloaded) {
              return downloaded.id;
            });
            $scope.bases.map(function(base) {
              if (basesId.length > 0 && basesId.indexOf(base.id) > -1) {
                base.downloaded = true;
              }
              return base;
            });
            $ionicLoading.hide();
          }, function() {
            noNetwork();
            $ionicLoading.hide();
          });
        } else {
          noNetwork();
          $ionicLoading.hide();
        }
      });
    }
  });
});
