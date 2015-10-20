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

          function render(data) {
            if (!data || data.length === 0) {
              return;
            }

            function createMultiSeries(data, metaData) {
              var items = [],
                minAttr = metaData.min || 'low',
                maxAttr = metaData.max || 'high',
                openAttr = metaData.open || 'open',
                closeAttr = metaData.close || 'close',
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
                high: maxAttr,
                low: minAttr,
                addCrosshair: function () { return addCrosshair(candlestick); }
              };
            }

            var multiSeries = createMultiSeries(data, scope.metaData);

            if (scope.crosshair) {
              multiSeries.addCrosshair();
            }

            var chart = fc.chart.linearTimeSeries()
              .xDomain(fc.util.extent(data, 'date'))
              .yDomain(fc.util.extent(data, [multiSeries.high, multiSeries.low]))
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
