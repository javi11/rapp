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

  $ionicModal.fromTemplateUrl('templates/records/save.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  function OnStart() {
    $scope.startRecordBtn = false;
    $scope.stopRecordBtn = true;
  }

  function OnStop() {
    $scope.startRecordBtn = false;
    $scope.stopRecordBtn = false;
    $scope.playRecordBtn = true;
  }

  function OnSaved(result) {

    $ionicLoading.hide();

    if (result.code !== 200) {
      return;
    }

    $scope.modal.show();
    $scope.startRecordBtn = true;
    $scope.stopRecordBtn = false;
    $scope.saveRecordBtn = false;
    $scope.playRecordBtn = false;
  }

  $scope.startRecord = function() {
    console.log('polaa');
    OnStart();
    $record.start();
  };

  $scope.stopRecord = function() {
    OnStop();
    $record.stop();
  };

  $scope.playRecord = function() {
    $record.play();
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
      template: 'Loading...'
    });
    console.log('SAVE RECORD');
    console.log($scope.record);
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
