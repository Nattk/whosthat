angular.module('whosthat', ['ionic', 'whosthat.controllers', 'whosthat.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

// Configuraton des différentes states
.config(function($stateProvider, $urlRouterProvider,$cordovaInAppBrowserProvider) {


$stateProvider

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl',
    controllerAs:'hCtrl'
  })

  .state('loading', {
      url: '/loading',
      templateUrl: 'templates/loading.html',
      controller: 'LoadingCtrl',
      controllerAs : 'loadCtrl'
    })

    .state('results', {
      url: '/results',
        templateUrl: 'templates/results.html',
        controller: 'ResultsCtrl',
        controllerAs: 'rsltCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
