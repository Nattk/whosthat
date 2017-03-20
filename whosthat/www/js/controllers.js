angular.module('whosthat.controllers', ['ngCordova',])

.controller('HomeCtrl', function($scope,PhotoFactory) {
  $scope.tout= function(){
    PhotoFactory.takePhoto().then(function(response){
        PhotoFactory.uploadPhoto(response);
      });
}
})


.controller('ResultsCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer) {
});
