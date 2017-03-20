angular.module('whosthat.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope,$cordovaCamera) {

  $scope.takePhoto = function () {
                 var options = {
                   quality: 75,
                   destinationType: Camera.DestinationType.FILE_URI,
                   sourceType: Camera.PictureSourceType.CAMERA,
                   allowEdit: false,
                   encodingType: Camera.EncodingType.JPEG,
                   targetWidth: 300,
                   targetHeight: 300,
                   popoverOptions: CameraPopoverOptions,
                   saveToPhotoAlbum: true
               };
  }

 $scope.getPhoto = function(){
     $cordovaCamera.getPicture(options).then(function (imageURI) {
       var image = document.getElementById('myImage');
       return imageURI;

     }, function (err) {
         alert('error');
     });
 }

})

.controller('LoadingCtrl', function($scope,$cordovaCamera) {
})

.controller('ResultsCtrl', function($scope,$cordovaCamera) {
});
