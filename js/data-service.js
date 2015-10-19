(function () {
  'use strict';

  angular.module('lowBarrel.service', [])
    .factory('weatherService', ['$http', function ($http) {

      function getData(callback) {
        return d3.tsv('data/20151015.tsv', function (d) {
            return process(d, new Date(2015, 10, 15), callback);
          });
      }

      function process(data, date, callback) {
        var stepSize = 6;
        var processed = [];
        var result = [];

        for (var i = 0, max = data.length; i < max; i += 1) {
          processed.push({ time: data[i].Time, temp: +data[i].Temp });

          if (processed.length % stepSize === 0) {
            var startIndex = i - stepSize + 1;
            var endIndex = i;

            var tempArray = processed
              .slice(startIndex, endIndex + 1)
              .map(function (p) { return p.temp; });

            var startTime = processed[startIndex].time;
            var endTime = processed[endIndex].time;
            var initialTemp = processed[startIndex].temp;
            var exitTemp = processed[endIndex].temp;
            var minTemp = Math.min.apply(Math, tempArray);
            var maxTemp = Math.max.apply(Math, tempArray);

            result.push({
              date: date,
              startTime: startTime,
              endTime: endTime,
              startTemp: initialTemp,
              endTemp: exitTemp,
              min: minTemp,
              max: maxTemp
            });
          }
        }

        callback(result);
      }

      return {
        getData: getData
      };
    }]);
}());