(function () {
  'use strict';

  angular.module('lowBarrel.weatherController', [])
    .controller('WeatherCtrl', ['weatherService', function (weatherService) {
      var self = this;
      self.data = [];

      self.splitOptions = [1, 2, 4, 6, 8, 12];
      self.stepSize = 4;

      self.splitChanged = function () {
        display();
      };

      self.typeOptions = ['Temperature', 'Humidity'];
      self.dataTypeKey = 'Humidity';

      self.typeChanged = function () {
        display();
      };

      self.metaData = {
        min: 'min' + self.dataTypeKey,
        max: 'max' + self.dataTypeKey,
        open: 'open' + self.dataTypeKey,
        close: 'close' + self.dataTypeKey
      };

      function display() {
        self.data = [];
        weatherService.getData().then(function (data) {
          self.data = process(data);
        });
      }

      function process(data) {
        var result = [];

        for (var i = self.stepSize - 1, max = data.length; i < max; i += self.stepSize) {
          var startIndex = i + 1 - self.stepSize;

          var temperatureData = fetchDataset(
            data, startIndex, function (d) { return d.temperature; });
          var humidityData = fetchDataset(
            data, startIndex, function (d) { return d.humidity; });

          result.push({
            date: data[startIndex].date,
            openTemperature: temperatureData.open,
            closeTemperature: temperatureData.close,
            minTemperature: temperatureData.low,
            maxTemperature: temperatureData.high,
            openHumidity: humidityData.open,
            closeHumidity: humidityData.close,
            minHumidity: humidityData.low,
            maxHumidity: humidityData.high
          });
        }

        return result;
      }

      function fetchDataset(data, startIndex, map) {
        var endIndex = startIndex + self.stepSize - 1;

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

      display();
    }]);
}());
