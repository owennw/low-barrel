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

  seriesHelper.legend = function(data, metadata) {
    var formatters = {
      date: d3.time.format('%a %d %b %Y, %H:%M')
    };

    function format(type, value) {
      return formatters[type](value);
    }

    var items = [
     ['Date:', function (d) { return format('date', d.date); }],
     ['Open:', function (d) { return d[metadata.open || 'open']; }],
     ['Close:', function (d) { return d[metadata.close || 'close']; }],
     ['Low:', function (d) { return d[metadata.min || 'low']; }],
     ['High:', function (d) { return d[metadata.max || 'high']; }]
    ];

    var legend = fc.chart.legend()
      .items(items);

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