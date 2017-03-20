angular.module('whosthat.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer,$ionicLoading,$q) {

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
$scope.uploadPhoto = function(imageURI){
  document.addEventListener('deviceready', function (imageURI) {
    var server = "http://shazoom.alwaysdata.net/upload/upload.php";
    $cordovaFileTransfer.upload(server, imageURI, options)
    .then(function(result) {
        // Success!
        alert('Success');
      }, function(err) {
        alert('errorUploade');
      }, function (progress) {
        // constant progress updates
      });

  }, false);
};
$scope.getPhoto = function(){
   var deferred = $q.defer();
   $cordovaCamera.getPicture(options).then(function (imageURI) {
     var image = document.getElementById('myImage');

   }, function (err) {
     alert('error');
   });
};
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
  $scope.getPhoto().then(function(response){
    deferred.resolve(response)
    alert(response);
   // $scope.uploadPhoto(imageURI);
  },
  function(response){
    deferred.reject(response);
    alert ('error');
  });
  return deferred.promise;

}





})


.controller('ResultsCtrl', function($scope,$cordovaCamera,$cordovaFileTransfer) {
});
