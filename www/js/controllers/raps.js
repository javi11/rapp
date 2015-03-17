/* global app */
'use strict';

app.controller('RapsCtrl', function($scope, RapList, $ionicModal) {
  $scope.raps = [];
  $scope.selected = null;

  $ionicModal.fromTemplateUrl('templates/records/play.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  RapList.getAll(function(err, list) {
    $scope.raps = list;
  });

  $scope.data = {
    showDelete: false
  };

  $scope.share = function(item) {
    console.log('Compartir: ' + item.id);
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.raps.splice(fromIndex, 1);
    $scope.raps.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(item) {
    RapList.delete(item, function() {
      $scope.raps.splice($scope.raps.indexOf(item), 1);
    });
  };

  $scope.open = function(item) {
    $scope.modal.show();
    $scope.selected = item;
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

});
