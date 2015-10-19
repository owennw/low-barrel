(function () {
  'use strict';

  angular.module('lowBarrel.graph', [])
    .directive('weatherLowBarrel', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metaData: '='
        },
        link: function (scope, element, attrs) {
         
          var margin = { top: 20, right: 20, bottom: 20, left: 20 },
            width = 1800 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

          var svg = d3.select(element[0]).append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

          function render(data) {
            if (!data || data.length === 0) {
              return;
            }

            var minAttr = scope.metaData.min;
            var maxAttr = scope.metaData.max;
            var openAttr = scope.metaData.open;
            var closeAttr = scope.metaData.close;

            var gridlines = fc.annotation.gridline();
            var candlestick = fc.series.candlestick()
              .yOpenValue(function (d) { return d[openAttr]; })
              .yCloseValue(function (d) { return d[closeAttr]; })
              .yHighValue(function (d) { return d[maxAttr]; })
              .yLowValue(function (d) { return d[minAttr]; });

            var multi = fc.series.multi()
              .series([gridlines, candlestick]);

            var chart = fc.chart.linearTimeSeries()
              .xDomain(fc.util.extent(data, 'date'))
              .yDomain(fc.util.extent(data, [maxAttr, minAttr]))
              .plotArea(multi);

            svg
              .datum(data)
              .call(chart);
          }

          scope.$watch('data', function () {
            render(scope.data);
          }, true);

          scope.$watch('metaData', function () {
            render(scope.data);
          }, true);
        }
      };
    });
}());
