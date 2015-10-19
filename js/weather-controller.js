(function () {
  'use strict';

  angular.module('lowBarrel.weatherController', [])
    .controller('WeatherCtrl', ['weatherService', function (weatherService) {
      var self = this;

      weatherService.getData(function (data) {
        self.data = data;
      });
    }]);
}());