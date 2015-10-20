(function (fc) {
  'use strict';

  angular.module('lowBarrel.volume', [])
    .directive('volumeChart', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          volumeType: '='
        },
        link: function (scope, element, attrs) {
          var margin = { top: 20, right: 20, bottom: 0, left: 20 },
            width = 1850 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

          var svg = d3.select(element[0]).append('svg')
            .attr("width", width)
            .attr("height", height);

          function render(data) {
            if (!data || data.length === 0) {
              return;
            }

            function createMultiSeries(data, type) {
              var items = [],
                bar,
                gridlines,
                multi;

              gridlines = fc.annotation.gridline();
              items.push(gridlines);

              bar = fc.series.bar()
                .yValue(function (d) { return d[type]; });
              items.push(bar);

              multi = fc.series.multi()
                .series(items);

              //var addCrosshair = function () {
              //  var crosshairData = [],
              //    crosshair;

              //  crosshair = fc.tool.crosshair()
              //    .snap(fc.util.seriesPointSnapXOnly(candlestick, data))
              //    .xLabel('')
              //    .yLabel('');
              //  items.push(crosshair);

              //  var series = multi.series();
              //  multi
              //    .series(series.concat(crosshair))
              //    .mapping(function (series) {
              //      switch (series) {
              //        case crosshair:
              //          return crosshairData;
              //        default:
              //          return data;
              //      }
              //    });
              //};

              return {
                multi: multi
                //addCrosshair: addCrosshair
              };
            }

            var multiSeries = createMultiSeries(data, scope.volumeType);

            //if (scope.crosshair) {
            //  multiSeries.addCrosshair();
            //}

            var chart = fc.chart.cartesianChart(fc.scale.dateTime())
              .xDomain(fc.util.extent(data, 'date'))
              .yDomain(fc.util.extent(data, [scope.volumeType]))
              .plotArea(multiSeries.multi);

            svg
              .datum(data)
              .call(chart);
          }

          scope.$watch('data', function () {
            render(scope.data);
          }, true);
        }
      };
    });
}(fc));
