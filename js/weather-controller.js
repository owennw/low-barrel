(function () {
  'use strict';

  angular.module('lowBarrel.weatherController', [])
    .controller('WeatherCtrl', ['weatherService', function (weatherService) {
      var self = this;
      self.data = [];

      weatherService.getData().then(function (data) {
        self.data = data;
      });
    }]);
}());
