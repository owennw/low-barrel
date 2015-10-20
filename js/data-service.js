(function () {
  'use strict';

  angular.module('lowBarrel.service', [])
    .factory('weatherService', ['$http', '$q', function ($http, $q) {

      var dates = ['2015-10-09', '2015-10-10', '2015-10-11', '2015-10-12', '2015-10-13', '2015-10-14', '2015-10-15'];

      function getData() {
        var promises = [];
        var result = [];
        for (var i = 0, max = dates.length; i < max; i += 1) {
          promises.push(fetchData(dates[i])
            .then(function (d) {
              result = result.concat(d);
            }));
        }

        return $q.all(promises)
          .then(function () {
            return result;
          });
      }

      function fetchData(date) {
        return $http.get('data/' + date + '.tsv')
          .then(function (d) {
            return d3.tsv.parse(d.data);
          })
          .then(function (d) {
            return process(d, date);
          });
      }

      function process(data, date) {
        var processed = [];

        for (var i = 0, max = data.length; i < max; i += 1) {

          // Use 'Z' to specify UTC time. This is incorrect for this data,
          // but produces a better chart.
          processed.push({
            startOfDay: data[i].Time === '00:00',
            date: new Date(date + 'T' + data[i].Time + 'Z'),
            temperature: +data[i].Temp,
            humidity: +data[i].Humid,
            dewPoint: +data[i].DewPt,
            avgWindSpeed: +data[i].WindSp,
            pressure: +data[i].Press,
            windDirection: data[i].WindDr,
            sun: +data[i].Sun,
            rain: +data[i].Rain,
            maxWindSpeed: +data[i].MxWSpd
          });
        }

        return processed;
      }

      return {
        getData: getData
      };
    }]);
}());
