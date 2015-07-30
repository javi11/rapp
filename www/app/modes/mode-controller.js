/* global controllers */
'use strict';

controllers
  .controller('ModesCtrl', function($scope, $state) {
    $scope.modes = [{
      name: 'Estilo libre',
      mode: 'freeStyle',
      description: 'Imporovisa sin límites durante 60º.',
      background: 'freeStyle'
    }, {
      name: 'Con Texto',
      mode: 'text',
      description: 'Rima con un sinfin de palabras.',
      background: 'text'
    }, {
      name: 'Con Temas',
      mode: 'theme',
      description: 'Elige un tema y trata de rimar todas las palabras.',
      background: 'theme'
    }];

    $scope.goToMode = function(mode) {
      $state.go('app.bases', {
        params: {
          mode: mode.mode
        }
      });
    };
  });
