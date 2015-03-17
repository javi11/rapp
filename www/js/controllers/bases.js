/* global app */
'use strict';

app.controller('BasesCtrl', function($scope, $record, $location, $ionicLoading, $ionicModal, $stateParams) {
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
    title: 'Reggae',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];

  if ($stateParams.id) {
    $scope.title = $scope.bases[$stateParams.id].title;
  }
});
