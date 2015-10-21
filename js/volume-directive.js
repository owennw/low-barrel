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
          var legendItemsAdded = false;

          var svg = d3.select(element[0]).append('svg')
            .style('width', '100%');

          function createMultiSeries() {
            var bar,
              gridlines,
              multi;

            gridlines = fc.annotation.gridline();

            bar = fc.series.bar()
              .yValue(function (d) { return d[scope.volumeType]; });

            multi = fc.series.multi()
              .series([gridlines, bar]);

            if (scope.crosshairData) {
              if (!legendItemsAdded) {
                seriesHelper.addLegendItems([
                  ['Volume:', function (d) { return seriesHelper.format('number', d[scope.volumeType]) }]
                ]);
                legendItemsAdded = true;
              }

              var crosshair = fc.tool.crosshair()
                .decorate(seriesHelper.legend())
                .snap(fc.util.seriesPointSnapXOnly(bar, scope.data))
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
              yDomain: [scope.volumeType],
              data: scope.data,
              svg: svg
            };
          }

          seriesHelper.register(createMultiSeries);
          scope.$watch('data', seriesHelper.render, true);
          scope.$watch('volumeType', seriesHelper.render, true);
        }
      };
    });
}(fc));
