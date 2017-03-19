angular.module('whosthat.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope,$cordovaCamera) {

  $scope.takePhoto = function () {
                 var options = {
                   quality: 75,
                   destinationType: Camera.DestinationType.DATA_URL,
                   sourceType: Camera.PictureSourceType.CAMERA,
                   allowEdit: false,
                   encodingType: Camera.EncodingType.JPEG,
                   targetWidth: 300,
                   targetHeight: 300,
                   popoverOptions: CameraPopoverOptions,
                   saveToPhotoAlbum: true
               };

                   $cordovaCamera.getPicture(options).then(function (imageData) {
                       $scope.imgURI = "data:image/jpeg;base64," + imageData;
                   }, function (err) {
                       // An error occured. Show a message to the user
                   });
  }
})

.controller('LoadingCtrl', function($scope,$cordovaCamera) {
})

.controller('ResultsCtrl', function($scope,$cordovaCamera) {
});
