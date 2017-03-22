angular.module('whosthat.controllers', ['ngCordova',])

.controller('HomeCtrl', function($scope,loadingService,photoService, $cordovaFileTransfer,FaceCompare) {
  loadingService.show();

  ionic.Platform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      loadingService.hide();
});

$scope.tout= function(){
  photoService.takePhoto().then(function(response){
    photoService.uploadPhoto(response);
  })
};


$scope.compare= function(){
  FaceCompare.compare().then(function(response){
      FaceCompare.confidenceCheck(response);
  });
};


})

.controller('ResultsCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer) {
});
