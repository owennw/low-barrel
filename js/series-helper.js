var seriesHelper = seriesHelper || {};

(function () {
  'use strict';
  var components = [];

  seriesHelper.register = function (createMultiSeries) {
    components.push(createMultiSeries);
  };

  seriesHelper.render = function () {
    components.forEach(function (createMultiSeries) {
      var multiSeries = createMultiSeries();
      var data = multiSeries.data;
      if (!data || data.length === 0) {
        return;
      }

      var chart = fc.chart.linearTimeSeries()
        .xDomain(fc.util.extent(data, multiSeries.xDomain))
        .yDomain(fc.util.extent(data, multiSeries.yDomain))
        .plotArea(multiSeries.multi);

      multiSeries.svg
        .datum(data)
        .transition()
        .duration(400)
        .call(chart);
    })
  }
}());