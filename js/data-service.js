(function () {
  'use strict';

  angular.module('lowBarrel.service', [])
    .factory('weatherService', ['$http', function ($http) {

      var dates = ['2015-10-09', '2015-10-10', '2015-10-11', '2015-10-12', '2015-10-13', '2015-10-14', '2015-10-15'];

      function getData(callback) {
        for (var i = 0, max = dates.length; i < max; i += 1) {
          fetchData(dates[i], callback);
        }
      }

      function fetchData(date, callback) {
        var results = [];
        return d3.tsv('data/' + date + '.tsv', function (d) {
          results = process(d, date);
          callback(results);
        });
      }

      function process(data, date) {
        var stepSize = 6;
        var processed = [];
        var results = [];

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