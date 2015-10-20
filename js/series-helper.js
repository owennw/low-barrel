var seriesHelper = seriesHelper || {};

(function () {
  'use strict';
  var transitionDuration = 500;

  function addCrosshair(multi, seriesToAddCrosshair, data, crosshairData) {
    var crosshair = fc.tool.crosshair()
      .snap(fc.util.seriesPointSnapXOnly(seriesToAddCrosshair, data))
      //.on('trackingstart.link', render)
      //.on('trackingmove.link', render)
      //.on('trackingend.link', render)
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
  }

  seriesHelper.render = function (svg, data, createMultiSeries, crosshairData) {
    if (!data || data.length === 0) {
      return;
    }

    var multiSeries = createMultiSeries();

    if (crosshairData) {
      addCrosshair(multiSeries.multi, multiSeries.crosshairSeries, data, crosshairData);
    }

    var chart = fc.chart.linearTimeSeries()
      .xDomain(fc.util.extent(data, multiSeries.xDomain))
      .yDomain(fc.util.extent(data, multiSeries.yDomain))
      .plotArea(multiSeries.multi);

    svg
      .datum(data)
      .transition()
      .duration(transitionDuration)
      .call(chart);
  }
}());