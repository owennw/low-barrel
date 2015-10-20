(function (fc) {
  'use strict';

  angular.module('lowBarrel.volume', [])
    .directive('volumeChart', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          volumeType: '=',
          crosshair: '='
        },
        link: function (scope, element, attrs) {
          var svg = d3.select(element[0]).append('svg')
            .style('width', '99%');

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

              var addCrosshair = function (series) {
                var crosshairData = [],
                  crosshair;

                crosshair = fc.tool.crosshair()
                  .snap(fc.util.seriesPointSnapXOnly(series, data))
                  .xLabel('')
                  .yLabel('');
                items.push(crosshair);

                var existingSeries = multi.series();
                multi
                  .series(existingSeries.concat(crosshair))
                  .mapping(function (mapSeries) {
                    switch (mapSeries) {
                      case crosshair:
                        return crosshairData;
                      default:
                        return data;
                    }
                  });
              };

              return {
                multi: multi,
                addCrosshair: function () { return addCrosshair(bar); }
              };
            }

            var multiSeries = createMultiSeries(data, scope.volumeType);

            if (scope.crosshair) {
              multiSeries.addCrosshair();
            }

            var chart = fc.chart.linearTimeSeries()
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
