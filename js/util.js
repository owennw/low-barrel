var d3fcUtil = d3fcUtil || {};

(function () {
  'use strict';

  d3fcUtil.addCrosshair = function (multi, seriesToAddCrosshair, data) {
    var crosshairData = [],
      crosshair;

    crosshair = fc.tool.crosshair()
      .snap(fc.util.seriesPointSnapXOnly(seriesToAddCrosshair, data))
      .xLabel('')
      .yLabel('');

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
}());