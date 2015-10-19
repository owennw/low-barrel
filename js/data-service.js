(function () {
  'use strict';

  angular.module('lowBarrel.service', [])
    .factory('weatherService', ['$http', function ($http) {

      function getData(callback) {
        var results = [];

        d3.tsv('data/2015-10-14.tsv', function (d) {
          process(d, '2015-10-14', results);
          callback(results);
        });
      }

      function process(data, date, results, callback) {
        var stepSize = 6;
        var processed = [];

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

            results.push({
              startDate: new Date(date + 'T' + startTime),
              endDate: new Date(date + 'T' + endTime),
              startTemp: initialTemp,
              endTemp: exitTemp,
              min: minTemp,
              max: maxTemp
            });
          }
        }

        return results;
      }

      return {
        getData: getData
      };
    }]);
}());