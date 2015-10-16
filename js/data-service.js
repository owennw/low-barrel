(function () {
  'use strict';

  angular.module('lowBarrel.service', [])
    .factory('weatherService', ['$http', function ($http) {

      function getData() {
        return $http.get('data/20151015.tsv')
          .then(function (weather) {
            return process(weather.data);
          });
      }

      function process(data) {
        return data;
      }

      return {
        getData: getData
      };
    }]);
}());