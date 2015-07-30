/* global controllers */
'use strict';

controllers
  .controller('BasesCtrl', function($ionicSideMenuDelegate, $ionicPlatform, $scope, $cordovaProgress, $ionicPopup, $rootScope, $record, $state, $ionicLoading, $ionicModal, $stateParams, $q, Bases, APPDIR, AudioSvc) {
    var downloading = false;

    $scope.details = null;
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

    $ionicModal.fromTemplateUrl('app/record/save.html', {
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
      alertPopup.then(function() {});
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

        AudioSvc.loadAudio($rootScope.appDir + APPDIR + '/tmp/' + $record.name());
        $scope.loaded = true;
        $scope.name = $record.name();
        $scope.path = $record.name();
      });
    };

    $rootScope.closeModal = function() {
      $scope.modal.hide();
      AudioSvc.loadAudio($rootScope.appDir + APPDIR + $scope.base.path + $scope.base.song);
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
        AudioSvc.loadAudio($rootScope.appDir + APPDIR + $scope.base.path + $scope.base.song);
      });
    });

    $scope.saveRecord = function() {
      $ionicLoading.show({
        template: 'Cargando.'
      });
      $record.save($scope.record).then(OnSaved, OnSaved);
    };

    $scope.$on('downloadBase', function(event, base) {
      $ionicLoading.show({
        template: 'Descargando base.'
      });
      downloading = true;
      Bases.download(base).then(function(res) {
        if (!res.status) {
          noNetwork();
        } else {
          var index = $scope.bases.indexOf(base);
          $scope.bases[index].downloaded = true;
        }
        $ionicLoading.hide();
      }, function(err) {
        var alertPopup = $ionicPopup.alert({
          cssClass: 'error',
          title: 'Alerta!',
          template: 'Ocurrió un error interno de la aplicación, por favor, elimine todos los datos de la aplicación y reiníciela.'
        });
        alertPopup.then(function() {});
        console.log(JSON.stringify(err));
        $ionicLoading.hide();
      });
    });
    $scope.$on('goToBase', function(event, base) {
      $state.go('app.base', {
        'id': base.$id
      });
    });

    $scope.showBaseDetails = function(base) {
      $scope.$emit('baseDetails', base);
    };
    $scope.playBase = function() {
      $scope.playBaseBtn = false;
      AudioSvc.playAudio(function(a, b) {
        $scope.position = Math.ceil(a / b * 100);
        if (a < 0) {
          $scope.pauseBase();
        }
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      });
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
        Bases.get($stateParams.id).once('value', function(baseSnap) {
          $scope.base = baseSnap.val();
          Bases.downloaded($scope.base, 0).then(function(response) {
            if (response.success) {
              AudioSvc.loadAudio($rootScope.appDir + APPDIR + '/bases/' + $scope.base.path + '/' + $scope.base.title + '.mp3');
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
              $state.go('app.bases');
            }
          }).then(function() {
            $ionicLoading.hide();
          });
        });
      } else {
        $scope.bases = Bases.getAll();
        $scope.$watch('bases', function() {
          //Don't update all bases when download ends.
          if (downloading) {
            downloading = false;
            return;
          }
          //Check if bases are downloaded

          var promises = [];
          $scope.bases.forEach(function(base, index) {
            promises.push(Bases.downloaded(base, index));
          });
          $q.all(promises).then(function(results) {
            for (var i = 0; i < results.length; i++) {
              if (results[i].success) {
                $scope.bases[results[i].index].downloaded = true;
              } else {
                $scope.bases[results[i].index].downloaded = false;
              }
            }
          });
          $ionicLoading.hide();
        }, true);
      }
    });
  });
