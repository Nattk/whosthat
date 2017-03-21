angular.module('whosthat.controllers', ['ngCordova',])

.controller('HomeCtrl', function($scope,PhotoFactory,FaceCompare) {
//   loadingService.show();
//
//   ionic.Platform.ready(function(){
//       // will execute when device is ready, or immediately if the device is already ready.
//       loadingService.hide();
// });
$scope.tout= function(){
  PhotoFactory.takePhoto().then(function(response){
      PhotoFactory.uploadPhoto(response);
    });
}

$scope.compare= function(){
  FaceCompare.compare();
}
})

.controller('ResultsCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer) {
});
