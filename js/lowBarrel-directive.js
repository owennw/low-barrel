(function () {
  'use strict';

  angular.module('lowBarrel.graph', [])
    .directive('weatherLowBarrel', function () {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        link: function (scope, element, attrs) {

          var render = function (data) {
          };

          scope.$watch('data', function () {
            render(scope.data);
          }, true);
        }
      };
    });
}());