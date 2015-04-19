/* global app */
'use strict';

app.controller('BasesCtrl', function($scope, $record, $location, $ionicLoading, $ionicModal, $stateParams, BaseList, APPDIR) {
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

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  function OnSaved() {
    $ionicLoading.hide();
    $scope.modal.hide();
    $scope.startRecordBtn = true;
    $scope.saveRecordBtn = false;
    $scope.playRecordBtn = false;
  }

  $scope.startRecord = function() {
    $scope.startRecordBtn = false;
    $record.start();
  };

  $scope.stopRecord = function() {
    $scope.startRecordBtn = true;
    $scope.playRecordBtn = true;
    $scope.playBaseBtn = true;
    $scope.modal.show();
    $record.stop();
    BaseList.pause();
  };

  $scope.playRecord = function() {
    $scope.playRecordBtn = false;
    $record.play();
  };

  $scope.pauseRecord = function() {
    $scope.playRecordBtn = true;
    $record.pause();
  };

  $scope.showSaveForm = function() {
    $scope.saveRecordBtn = true;
  };

  $scope.recordAgain = function() {
    $scope.startRecordBtn = true;
    $scope.playRecordBtn = false;
    $scope.saveRecordBtn = false;
    $scope.modal.hide();
  };

  $scope.saveRecord = function() {
    $ionicLoading.show({
      template: 'Cargando...'
    });
    console.log('SAVE RECORD');
    $record.save(OnSaved, $scope.record);
  };

  $scope.bases = [{
    id: 0,
    title: 'Aron Beats - Nosotros viviremos',
    path: '/bases/Aron/',
    song: 'Aron Beats - Nosotros viviremos.mp3'
  }, {
    id: 1,
    title: 'Apollo Brown - One man',
    path: '/bases/Apollo Brown/',
    song: 'Apollo Brown - One man.mp3'
  }];
  if ($stateParams.id) {
    if ($scope.bases[$stateParams.id]) {
      $scope.base = $scope.bases[$stateParams.id];
    }
  }
  $scope.playBase = function() {
    if ($stateParams.id) {
      BaseList.play($scope.bases[$stateParams.id]);
      $scope.playBaseBtn = false;
    }
  };

  $scope.pauseBase = function() {
    BaseList.pause();
    $scope.playBaseBtn = true;
  };
});
