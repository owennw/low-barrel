(function (fc) {
  'use strict';

  angular.module('lowBarrel.volume', [])
    .directive('volumeChart', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          volumeType: '=',
          crosshairData: '='
        },
        link: function (scope, element, attrs) {
          var svg = d3.select(element[0]).append('svg')
            .style('width', '99%');

          function createMultiSeries() {
            var bar,
              gridlines,
              multi;

            gridlines = fc.annotation.gridline();

            bar = fc.series.bar()
              .yValue(function (d) { return d[scope.volumeType]; });

            multi = fc.series.multi()
              .series([gridlines, bar]);

            return {
              multi: multi,
              xDomain: 'date',
              yDomain: [scope.volumeType],
              crosshairSeries: bar
            };
          }

          function renderHelper() {
            return seriesHelper.render(
              svg,
              scope.data,
              function () { return createMultiSeries(); },
              scope.crosshairData);
          }

          scope.$watch('data', renderHelper, true);
          scope.$watch('volumeType', renderHelper, true);
        }
      };
    });
}(fc));
