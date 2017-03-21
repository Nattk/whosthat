angular.module('whosthat.services', ['ngCordova'])
.service('loadingService', loadingService)
.service('photoService', photoService );

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

function photoService($http,$cordovaCamera,$cordovaFileTransfer){
 	this.takePhoto = function(){
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

      return $cordovaCamera.getPicture(options)
      

    },

    this.uploadPhoto = function(response){
    	var server = "http://shazoom.alwaysdata.net/upload.php";
    	var trustAllHosts = true;
   	 	var options = new FileUploadOptions();
   	 	options.fileKey = "file";
   	 	options.fileName = response.substr(response.lastIndexOf('/') +1);
   	 	options.mimeType = "image/jpeg";
   	 	options.chunkedMode = false;
        $cordovaFileTransfer.upload(server, response, options, trustAllHosts)
        .then(function(result) {
            alert(JSON.stringify(result));
          }, function(err) {
            alert(JSON.stringify(err));
          }, function (progress) {
            // constant progress updates
          });
    }
}
