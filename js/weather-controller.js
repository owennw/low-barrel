(function () {
  'use strict';

  angular.module('lowBarrel.weatherController', [])
    .controller('WeatherCtrl', ['weatherService', function (weatherService) {
      var self = this;
      self.data = [];

      weatherService.getData().then(function (data) {
        self.data = process(data);
      });

      var process = function (data) {
        var result = [];
        var stepSize = 4;

        for (var i = 0, max = data.length; i < max; i += 1) {
          var length = i + 1;

          if (length % stepSize === 0) {
            var startIndex = length - stepSize;
            var endIndex = i;

            var tempArray = data
              .slice(startIndex, endIndex + 1)
              .map(function (p) { return p.temperature; });

            var startTime = data[startIndex].time;
            var initialTemp = data[startIndex].temperature;
            var exitTemp = data[endIndex].temperature;
            var minTemp = Math.min.apply(Math, tempArray);
            var maxTemp = Math.max.apply(Math, tempArray);

            result.push({
              date: data[startIndex].date,
              open: initialTemp,
              close: exitTemp,
              low: minTemp,
              high: maxTemp
            });
          }
        }

        return result;
      };
    }]);
}());
