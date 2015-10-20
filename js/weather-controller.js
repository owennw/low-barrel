﻿(function () {
  'use strict';

  angular.module('lowBarrel.weatherController', [])
    .controller('WeatherCtrl', ['weatherService', function (weatherService) {
      var self = this;
      var dataCache = [];
      self.data = [];

      self.splitOptions = [2, 4, 6, 8, 12, 24];
      self.stepSize = 4;

      self.splitChanged = function () {
        display();
      };

      self.typeOptions = ['Temperature', 'Humidity', 'DewPoint', 'Pressure'];
      self.dataTypeKey = 'Temperature';

      self.typeChanged = function () {
        display();
      };

      function metaData() {
        return {
          min: 'min' + self.dataTypeKey,
          max: 'max' + self.dataTypeKey,
          open: 'open' + self.dataTypeKey,
          close: 'close' + self.dataTypeKey
        };
      }

      function display() {
        self.data = [];
        self.metaData = metaData();

        // Must have the same code in both halves since without using the cache
        // the request is asynchronous, but using the cache is synchronous.
        if (!dataCache || dataCache.length === 0) {
          weatherService.getData().then(function (data) {
            dataCache = data;
            self.data = process(dataCache);
          });
        } else {
          self.data = process(dataCache);
        }
      }

      function process(data) {
        // This function converts the raw weather data into specific formats 
        // suitable for the candlestick display
        var result = [];

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

        function fetchCumulativeDataset(data, startIndex, map) {
          var firstIndex = startIndex === 0 ? 0 : startIndex - 1,
            endIndex = startIndex + self.stepSize;

          // Bring the element before the start of this data slice to calculate
          // value per time interval, instead of cumulative
          return {
            volume: map(data[endIndex]) - map(data[firstIndex])
          };
        }

        for (var i = self.stepSize - 1, max = data.length; i < max; i += self.stepSize) {
          var startIndex = i + 1 - self.stepSize;

          var temperatureData = fetchDataset(
            data, startIndex, function (d) { return d.temperature; });
          var humidityData = fetchDataset(
            data, startIndex, function (d) { return d.humidity; });
          var dewPointData = fetchDataset(
            data, startIndex, function (d) { return d.dewPoint; });
          var pressureData = fetchDataset(
            data, startIndex, function (d) { return d.pressure; });
          var sunData = fetchCumulativeDataset(
            data, startIndex, function (d) { return d.sun; });
          var rainData = fetchCumulativeDataset(
            data, startIndex, function (d) { return d.rain; });

          result.push({
            date: data[startIndex].date,
            openTemperature: temperatureData.open,
            closeTemperature: temperatureData.close,
            minTemperature: temperatureData.low,
            maxTemperature: temperatureData.high,
            openHumidity: humidityData.open,
            closeHumidity: humidityData.close,
            minHumidity: humidityData.low,
            maxHumidity: humidityData.high,
            minDewPoint: dewPointData.low,
            maxDewPoint: dewPointData.high,
            openDewPoint: dewPointData.open,
            closeDewPoint: dewPointData.close,
            minPressure: pressureData.low,
            maxPressure: pressureData.high,
            openPressure: pressureData.open,
            closePressure: pressureData.close,
            rainVolume: rainData.volume,
            sunVolume: sunData.volume
          });
        }

        return result;
      }

      display();
    }]);
}());
