(function () {
  'use strict';

  angular.module('lowBarrel.weatherController', [])
    .controller('WeatherCtrl', ['weatherService', function (weatherService) {
      var self = this;
      self.data = [];
      var stepSize = 4;

      self.props = function () {
        var min = 'minTemp';
        var max = 'maxTemp';
        var open = 'openTemp';
        var close = 'closeTemp';

        return {
          min: min,
          max: max,
          open: open,
          close: close
        };
      };

      weatherService.getData().then(function (data) {
        self.data = process(data);
      });

      var process = function (data) {
        var result = [];

        for (var i = stepSize - 1, max = data.length; i < max; i += stepSize) {
          var startIndex = i + 1 - stepSize;

          var temperatureData = fetchDataset(
            data, startIndex, function (d) { return d.temperature; });
          var humidityData = fetchDataset(
            data, startIndex, function (d) { return d.humidity; });

          result.push({
            date: data[startIndex].date,
            openTemp: temperatureData.open,
            closeTemp: temperatureData.close,
            minTemp: temperatureData.low,
            maxTemp: temperatureData.high,
            openHumidity: humidityData.open,
            closeHumidity: humidityData.close,
            minHumidity: humidityData.min,
            maxHumidity: humidityData.max
          });
        }

        return result;
      };

      function fetchDataset(data, startIndex, map) {
        var endIndex = startIndex + stepSize - 1;

        var tempArray = data
          .slice(startIndex, endIndex + 1)
          .map(map);

        return {
          open: map(data[startIndex]),
          close: map(data[endIndex]),
          high: Math.max.apply(Math, tempArray),
          low: Math.min.apply(Math, tempArray)
        };
      }
    }]);
}());
