angular.module('whosthat.services', ['ngCordova'])
.service('loadingService', loadingService)
.service('photoService', photoService )

.factory('FaceCompare', function($http,$q) {
  const SERVER_URL ="http://shazoom.alwaysdata.net/";
  const API_KEY = 'Vrw1X_hkh_ZLiP2CXuX3iUbJgY9Oe5Cs';
  const API_SECRET = 'GBYvqVlQxdEbfGMeQBLmmoFFmTYsBgMN';
  const API_URL = 'https://api-us.faceplusplus.com/facepp/v3/compare?api_key=';

  return{

    compareCheck : function(url1,item){
      var deferred = $q.defer();
      $http.post(API_URL + API_KEY + '&api_secret=' + API_SECRET + '&image_url1=' +url1+ '&image_url2='+SERVER_URL+'ref/'+item)
      .then(function(response){

        deferred.resolve({name:item,confidence:response.data.confidence})
      },function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    } ,

    compare : function(){

      var deferred = $q.defer();
      var img_links =[];
      var promises = [];
      var url1='https://aspenpeak-magazine.com/get/files/image/migration/11670_content_robert-deniro-aspen-peak-1-1.jpg';
      var url2='https://image.noelshack.com/fichiers/2015/32/1438766535-ryan-reynolds.jpg';
      var my = this ;

      $http.jsonp(SERVER_URL+'scandir.php?callback=JSON_CALLBACK').then(function(response){
          response.data.forEach(function(item){
            img_links.push(item);
          });

        return img_links
        }).then(function(links){

          links.forEach(function(item){
            promises.push(my.compareCheck(url1,item));
          });

          $q.all(promises).then(function(data){
            deferred.resolve(data);
          });

      },function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },

    confidenceCheck: function(datas){
      var matches = [];
      datas.forEach(function(item,index){
        if(item.confidence > 75){
          matches.push(item);
        }
        else{
          console.log('none');
        }
      });
      console.log(matches);
      return matches;

    }

  }

});
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
