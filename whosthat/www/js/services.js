angular.module('whosthat.services', ['ngCordova'])

.factory('PhotoFactory', function($http,$q,$cordovaCamera,$cordovaFileTransfer) {
  const API_URL ="http://greenvelvet.alwaysdata.net/kwick/api/";

  return {

    takePhoto : function(){
      var options = {
        quality: 1,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      return this.getPhoto(options);

    },

    getPhoto : function(options){
      var deferred = $q.defer();
      $cordovaCamera.getPicture(options).then(function(imageURI) {
        deferred.resolve(imageURI);
        //alert(imageURI);

      }, function (imageURI) {
        deferred.reject(imageURI)
        alert('error');
      });

      return deferred.promise;
    },

    uploadPhoto : function(imageURI){
      document.addEventListener('deviceready', function () {
        alert(imageURI);
        var server = "http://shazoom.alwaysdata.net/upload/upload.php";
        $cordovaFileTransfer.upload(server, imageURI, options)
        .then(function(result) {
            alert('Success');
          }, function(err) {
            alert('errorUploade');
          }, function (progress) {
            // constant progress updates
          });

      }, false);
    }
}})

.service('loadingService', loadingService);

function loadingService($ionicLoading){
	this.show = function() {
		$ionicLoading.show({
			templateUrl: 'templates/loading.html',
		}).then(function(){
			console.log("The loading indicator is now displayed");
		});
	};
	this.hide = function(){
		$ionicLoading.hide().then(function(){
			console.log("The loading indicator is now hidden");
		});
	};
}
