(function () {
  'use strict';

  angular.module('lowBarrel.weatherController', [])
    .controller('WeatherCtrl', ['store', 'weatherService', function (store, dataService) {
      var self = this,
        myStore = myStore(),
        dataCache;

      self.data = [];
      self.crosshairData = [];
      self.splitOptions = [2, 4, 6, 8, 12, 24];
      self.stepSize = myStore.get('stepSize', 4);
      self.continuousTypeOptions = ['Temperature', 'Humidity', 'DewPoint', 'Pressure'];
      self.continuousTypeKey = myStore.get('continuousTypeKey', self.continuousTypeOptions[0]);
      self.discreteTypeOptions = ['Rainfall', 'Sunlight'];
      self.discreteTypeKey = myStore.get('discreteTypeKey', self.discreteTypeOptions[0]);

      function display() {
        self.data = [];
        self.continuousMetaData = continuousMetaData();
        self.discreteMetaData = discreteMetaData();

        // Must have the process in both halves since without using the cache
        // the request is asynchronous, but using the cache is synchronous.
        if (!dataCache) {
          dataService.getData().then(function (data) {
            dataCache = data;
            self.data = process(dataCache);
          });
        } else {
          self.data = process(dataCache);
        }
      }

      function process(data) {
        // This function converts the raw weather data into specific formats 
        // suitable for the displays
        var result = [];

        // The data is given in increments of 30 minutes
        var hourStepSize = self.stepSize * 2;

        for (var i = hourStepSize - 1, max = data.length; i < max; i += hourStepSize) {
          var startIndex = i + 1 - hourStepSize;

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

        function fetchDataset(data, startIndex, map) {
          var endIndex = startIndex + hourStepSize - 1;

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
          var firstIndex = data[startIndex].startOfDay === true ? startIndex : startIndex - 1,
            endIndex = startIndex + hourStepSize - 1;

          // Bring the element before the start of this data slice to calculate
          // value per time interval, instead of cumulative
          return {
            volume: map(data[endIndex]) - map(data[firstIndex])
          };
        }
      }

      function continuousMetaData() {
        return {
          min: 'min' + self.continuousTypeKey,
          max: 'max' + self.continuousTypeKey,
          open: 'open' + self.continuousTypeKey,
          close: 'close' + self.continuousTypeKey
        };
      }

      function discreteMetaData() {
        return self.discreteTypeKey === 'Rainfall' ? 'rainVolume' : 'sunVolume';
      }

      function myStore() {
        // wraps the store object
        return {
          get: function (name, defaultValue) {
            return store.get(name) || defaultValue;
          },
          set: function (name, value) {
            store.set(name, value);
          }
        }
      }

      self.splitChanged = function () {
        myStore.set('stepSize', self.stepSize);
        display();
      };

      self.continuousTypeChanged = function () {
        myStore.set('continuousTypeKey', self.continuousTypeKey);
        display();
      };

      self.discreteTypeChanged = function () {
        myStore.set('discreteTypeKey', self.discreteTypeKey);
        display();
      };

      display();
    }]);
}());
