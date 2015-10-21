(function (fc) {
  'use strict';

  angular.module('lowBarrel.candlestick', [])
    .directive('candlestickChart', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          metaData: '=',
          crosshairData: '='
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

            if (scope.crosshairData) {
              var crosshair = fc.tool.crosshair()
                .snap(fc.util.seriesPointSnapXOnly(candlestick, scope.data))
                .on('trackingstart.link', seriesHelper.render)
                .on('trackingmove.link', seriesHelper.render)
                .on('trackingend.link', seriesHelper.render)
                .xLabel('')
                .yLabel('');

              var existingSeries = multi.series();
              multi
                .series(existingSeries.concat(crosshair))
                .mapping(function (mapSeries) {
                  switch (mapSeries) {
                    case crosshair:
                      return scope.crosshairData;
                    default:
                      return scope.data;
                  }
                });
            }

            return {
              multi: multi,
              xDomain: 'date',
              yDomain: [maxAttr, minAttr],
              data: scope.data,
              svg: svg
            };
          }

          scope.$watch('data', seriesHelper.render, true);
          scope.$watch('metaData', seriesHelper.render, true);
          seriesHelper.register(createMultiSeries);
        }
      };
    });
}(fc));
