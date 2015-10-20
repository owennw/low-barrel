(function (fc) {
  'use strict';

  angular.module('lowBarrel.candlestick', [])
    .directive('candlestickChart', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metaData: '=',
          crosshair: '='
        },
        link: function (scope, element, attrs) {
          var svg = d3.select(element[0]).append('svg')
            .style('width', '99%');

          function createMultiSeries() {
            var minAttr = scope.metaData.min || 'low',
              maxAttr = scope.metaData.max || 'high',
              openAttr = scope.metaData.open || 'open',
              closeAttr = scope.metaData.close || 'close',
              gridlines,
              candlestick,
              multi;

            gridlines = fc.annotation.gridline();

            candlestick = fc.series.candlestick()
              .yOpenValue(function (d) { return d[openAttr]; })
              .yCloseValue(function (d) { return d[closeAttr]; })
              .yHighValue(function (d) { return d[maxAttr]; })
              .yLowValue(function (d) { return d[minAttr]; });

            multi = fc.series.multi()
              .series([gridlines, candlestick]);

            return {
              multi: multi,
              xDomain: 'date',
              yDomain: [maxAttr, minAttr],
              crosshairSeries: candlestick
            };
          }

          function renderHelper() {
            return seriesHelper.render(
              svg,
              scope.data,
              function () { return createMultiSeries(); },
              scope.crosshair);
          }

          scope.$watch('data', renderHelper, true);
          scope.$watch('metaData', renderHelper, true);
        }
      };
    });
}(fc));
