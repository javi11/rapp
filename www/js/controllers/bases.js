/* global app */
'use strict';

app.controller('BasesCtrl', function($scope, $record, $location, $ionicLoading, $ionicModal, $stateParams, BaseList) {
  $scope.recording = false;

  $scope.record = {
    tags: [],
    text: '',
    name: ''
  };

  $scope.startRecordBtn = true;
  $scope.stopRecordBtn = false;
  $scope.saveRecordBtn = false;
  $scope.playRecordBtn = false;
  $scope.pauseRecordBtn = false;
  $scope.playBaseBtn = true;
  $scope.pauseBaseBtn = false;

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

    $scope.modal.show();
    $scope.startRecordBtn = true;
    $scope.stopRecordBtn = false;
    $scope.saveRecordBtn = false;
    $scope.playRecordBtn = false;
    $scope.pauseRecordBtn = false;
  }

  $scope.startRecord = function() {
    $scope.startRecordBtn = false;
    $scope.stopRecordBtn = true;
    $record.start();
  };

  $scope.stopRecord = function() {
    $scope.startRecordBtn = false;
    $scope.stopRecordBtn = false;
    $scope.playRecordBtn = true;
    $record.stop();
  };

  $scope.playRecord = function() {
    $scope.playRecordBtn = false;
    $scope.pauseRecordBtn = true;
    $record.play();
  };

  $scope.pauseRecord = function() {
    $scope.pauseRecordBtn = false;
    $scope.playRecordBtn = true;
    $record.pause();
  };

  $scope.showSaveForm = function() {
    $scope.saveRecordBtn = true;
  };

  $scope.recordAgain = function() {
    $scope.startRecordBtn = true;
    $scope.stopRecordBtn = false;
    $scope.playRecordBtn = false;
    $scope.saveRecordBtn = false;
  };

  $scope.saveRecord = function() {
    $ionicLoading.show({
      template: 'Cargando...'
    });
    console.log('SAVE RECORD');
    $record.save(OnSaved, $scope.record);
  };


  $scope.bases = [{
    id: 1,
    title: 'Aron Beats - Nosotros viviremos',
    path: '/bases/Aron Beats - Nosotros viviremos.mp3'
  }, {
    id: 2,
    title: 'Apollo Brown - One man',
    path: '/bases/Apollo Brown - One man.mp3'
  }];

  $scope.playBase = function() {
    if ($stateParams.id) {
      BaseList.play($scope.bases[$stateParams.id]);
      $scope.playBaseBtn = false;
      $scope.pauseBaseBtn = true;
    }
  };

  $scope.pauseBase = function() {
    BaseList.pause();
    $scope.playBaseBtn = true;
    $scope.pauseBaseBtn = false;
  };


  if ($stateParams.id) {
    $scope.title = $scope.bases[$stateParams.id].title;
  }
});
