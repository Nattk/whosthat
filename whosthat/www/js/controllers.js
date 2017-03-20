angular.module('whosthat.controllers', ['ngCordova',])

.controller('HomeCtrl', function($scope,loadingService,PhotoFactory) {
  loadingService.show();

  ionic.Platform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      loadingService.hide();
});
$scope.tout= function(){
  PhotoFactory.takePhoto().then(function(response){
      PhotoFactory.uploadPhoto(response);
    });
}
})


.controller('ResultsCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer) {
});
