(function (fc) {
  'use strict';

  angular.module('lowBarrel.candlestick', [])
    .directive('candlestick', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metaData: '=',
          crosshair: '='
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

            function createMultiSeries(data, metaData, hasCrosshair) {
              var items = [],
                crosshairData = [],
                crosshair,
                minAttr = metaData.min,
                maxAttr = metaData.max,
                openAttr = metaData.open,
                closeAttr = metaData.close,
                gridlines,
                candlestick,
                multi;

                gridlines = fc.annotation.gridline();
                items.push(gridlines);

                candlestick = fc.series.candlestick()
                  .yOpenValue(function (d) { return d[openAttr]; })
                  .yCloseValue(function (d) { return d[closeAttr]; })
                  .yHighValue(function (d) { return d[maxAttr]; })
                  .yLowValue(function (d) { return d[minAttr]; });
                items.push(candlestick);

              if (hasCrosshair) {
                crosshair = fc.tool.crosshair()
                  .snap(fc.util.seriesPointSnapXOnly(candlestick, data))
                  .xLabel('')
                  .yLabel('');
                items.push(crosshair);
              }

              multi = fc.series.multi()
                .series(items)
                .mapping(function (series) {
                  switch (series) {
                    case crosshair:
                      return crosshairData;
                    default:
                      return data;
                  }
                });

              return {
                multi: multi,
                maxAttr: maxAttr,
                minAttr: minAttr
              };
            }

            var multiSeries = createMultiSeries(data, scope.metaData, scope.crosshair);

            var chart = fc.chart.linearTimeSeries()
              .xDomain(fc.util.extent(data, 'date'))
              .yDomain(fc.util.extent(data, [multiSeries.maxAttr, multiSeries.minAttr]))
              .plotArea(multiSeries.multi);

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
}(fc));
