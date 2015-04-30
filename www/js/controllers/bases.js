/* global app, cordova */
'use strict';

app.controller('BasesCtrl', function($ionicPlatform, $scope, $rootScope, $record, $location, $ionicLoading, $ionicModal, $stateParams, BaseList, APPDIR, AudioSvc) {
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

  function OnSaved() {
    $ionicLoading.hide();
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
    $scope.startRecordBtn = true;
    $scope.playRecordBtn = false;
    $scope.saveRecordBtn = false;
    $scope.modal.hide();
    $record.clearTmp(function() {
      AudioSvc.loadAudio(cordova.file.externalRootDirectory + APPDIR + $scope.base.path + $scope.base.song);
    });
  };

  $scope.saveRecord = function() {
    $ionicLoading.show({
      template: 'Cargando...'
    });
    console.log('SAVE RECORD');
    $record.save($scope.record, OnSaved);
  };

  $scope.bases = [{
    id: 0,
    title: 'Aron Beats - Nosotros viviremos',
    path: '/bases/Aaron Beats/',
    song: 'Aron Beats - Nosotros viviremos.mp3'
  }, {
    id: 1,
    title: 'Army of the pharaohs - Dumb the clip',
    path: '/bases/Army of the pharaohs/',
    song: 'Army of the pharaohs - Dumb the clip.mp3'
  }, {
    id: 2,
    title: 'Baghira - Bozal',
    path: '/bases/Baghira/',
    song: 'Baghira - Bozal.mp3'
  }, {
    id: 3,
    title: 'Diam\'s - La Boulette',
    path: '/bases/Diam',
    song: 'Diam - La Boulette.mp3'
  }, {
    id: 4,
    title: 'Eminem at Westwood',
    path: '/bases/Eminem/',
    song: 'Eminem at Westwood.mp3'
  }, {
    id: 5,
    title: 'Flowklorikos - Kloroformo',
    path: '/bases/Flowklorikos/',
    song: 'Flowklorikos - Kloroformo.mp3'
  }, {
    id: 6,
    title: 'Full Clip - Gangstarr',
    path: '/bases/Full Clip/',
    song: 'Full Clip - Gangstarr.mp3'
  }, {
    id: 7,
    title: 'Baghira - Red instrumental 96 bpm',
    path: '/bases/Baghira/',
    song: 'Baghira - Red instrumental 96 bpm.mp3'
  }];
  if ($stateParams.id) {
    if ($scope.bases[$stateParams.id]) {
      $scope.base = $scope.bases[$stateParams.id];
      console.log($scope.base);
      $ionicPlatform.ready(function() {
        AudioSvc.loadAudio(cordova.file.externalRootDirectory + APPDIR + $scope.base.path + $scope.base.song);
      });
    }
  }
  $scope.playBase = function() {
    if ($stateParams.id) {
      $scope.playBaseBtn = false;
      $ionicPlatform.ready(function() {
        AudioSvc.playAudio(function(a, b) {
          $scope.position = Math.ceil(a / b * 100);
          console.log(a);
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
});
