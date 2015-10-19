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
          var margin = { top: 20, right: 20, bottom: 20, left: 20 },
            width = 1800 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

          var svg = d3.select(element[0]).append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

          var render = function (data) {
            if (!data || data.length === 0) {
              return;
            }

            var gridlines = fc.annotation.gridline();
            var candlestick = fc.series.candlestick();

            var multi = fc.series.multi()
              .series([gridlines, candlestick]);

            var chart = fc.chart.linearTimeSeries()
              .xDomain(fc.util.extent(data, 'date'))
              .yDomain(fc.util.extent(data, ['high', 'low']))
              .plotArea(multi);

            svg
              .datum(data)
              .call(chart);
          };

          scope.$watch('data', function () {
            render(scope.data);
          }, true);
        }
      };
    });
}());
