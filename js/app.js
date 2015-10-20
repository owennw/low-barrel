(function () {
  'use strict';

  angular.module(
    'lowBarrel',
    [
      'angular-storage',
      'lowBarrel.service',
      'lowBarrel.weatherController',
      'lowBarrel.candlestick',
      'lowBarrel.volume'
    ]);

}());