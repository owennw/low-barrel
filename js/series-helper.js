var seriesHelper = seriesHelper || {};

(function () {
  'use strict';
  var components = [];
  var legendItems = [];

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
        .call(chart);
    })
  }

  seriesHelper.format = function (type, value) {
    var formatters = {
      date: d3.time.format('%a %d %b %Y, %H:%M'),
      number: d3.format('.2f')
    };

    return formatters[type](value);
  };

  seriesHelper.addLegendItems = function (items) {
    legendItems = legendItems.concat(items);
  }

  seriesHelper.legend = function () {
    var legend = fc.chart.legend()
      .items(legendItems);

    return function (selection) {
      var datum;

      try {
        datum = selection.datum().datum;
        d3.select('#legend')
          .data([datum])
          .call(legend);
      } catch (err) {
        // Do nothing
      }
    }
  }
}());