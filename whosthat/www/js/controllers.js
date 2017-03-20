angular.module('whosthat.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer,$ionicLoading) {

 $scope.show = function() {
    $ionicLoading.show({
     templateUrl: 'templates/loading.html',
    }).then(function(){
       console.log("The loading indicator is now displayed");
       $scope.hide();
    });
  };
  $scope.show();
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };

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
  }.then(function(src){
    $scope.uploadPhoto(src);
  });
  $scope.uploadPhoto = function(){
    document.addEventListener('deviceready', function () {
      var server = "http://shazoom.alwaysdata.net/upload/upload.php";
      $cordovaFileTransfer.upload(server, filePath, options)
      .then(function(result) {
        // Success!
      }, function(err) {
        // Error
      }, function (progress) {
        // constant progress updates
      });

    }, false);
  }
})


.controller('ResultsCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer) {
});
