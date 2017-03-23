angular.module('whosthat.services', ['ngCordova'])
.service('loadingService', loadingService)
.service('photoService', photoService)

.factory('FaceCompare', function($http,$q) {

  //définition des constantes
  const SERVER_URL ="http://shazoom.alwaysdata.net/";
  const API_KEY = 'Vrw1X_hkh_ZLiP2CXuX3iUbJgY9Oe5Cs';
  const API_SECRET = 'GBYvqVlQxdEbfGMeQBLmmoFFmTYsBgMN';
  const API_URL = 'https://api-us.faceplusplus.com/facepp/v3/compare?api_key=';

  return{

    //appel de l'api pour la comparaison entre la capture et les photos du serveur
    compareCheck : function(url1,item){

      var deferred = $q.defer();
      $http.post(API_URL + API_KEY + '&api_secret=' + API_SECRET + '&image_url1=' +url1+ '&image_url2='+SERVER_URL+'ref/'+item).then(function(response){

        deferred.resolve({name:item,confidence:response.data.confidence})

      },function(err){

        deferred.reject(err);
        alert('une erreur s\'est produite');
      });

      return deferred.promise;
    },

    //liste les photos d'acteurs sur le serveur
    //appel la fonction de comparaison
    compare : function(result){

      var deferred = $q.defer();
      var img_links =[];
      var promises = [];
      var url1='http://shazoom.alwaysdata.net/upload/'+result;
      var my = this ;

      //Fichier serveur permettant de listé les photos contenus dans le serveur
      $http.jsonp(SERVER_URL+'scandir.php?callback=JSON_CALLBACK').then(function(response){
          response.data.forEach(function(item){
            img_links.push(item);
          });

        return img_links
        }).then(function(links){

          //Envoi les promesses dans un tableau
          links.forEach(function(item){
            promises.push(my.compareCheck(url1,item));
          });

          //Envoi un résulat que lorque que
          //toutes les promesses sont exécutés

          $q.all(promises).then(function(data){
            deferred.resolve(data);
          });

      },function(err){
        alert('une erreur s\'est produite');
        deferred.reject(err);
      });

      return deferred.promise;
    },

    //Vérifie si le taux de confidence est assez élévé
    //Renvoi un tableau avec les infos pertinentes

    confidenceCheck: function(datas){
      var deferred = $q.defer();
      var matches = [];
      datas.forEach(function(item,index){

        if(item.confidence > 70){
          matches.push(item);
        }
        else{
          //nothing
        }

      });
      deferred.resolve(matches);

      return deferred.promise;

    }
	}
})

//Factory which get Wiki informations from the actor

.factory('WikiFactory', function($http,$q){

  const API_URL ="https://fr.wikipedia.org/w/api.php?&action=query&format=json&callback=JSON_CALLBACK&prop=extracts&exintro=&explaintext=&indexpageids=&titles=";

  return {

    //Appel de l'api mediaWiki
    get  : function(name){

      var deferred = $q.defer();
      $http.jsonp(API_URL+name, function(data){
        return data;
      })
       .then(function(response){
         var pageId = response.data.query.pageids[0];

         //objet avec réponse traité
         var dataObj = {
          title: response.data.query.pages[pageId].title,
          extract: response.data.query.pages[pageId].extract
         }
         deferred.resolve(dataObj);
       },
        function(err){

          deferred.reject(err);
          alert('une erreur s\'est produite');

        });
        return deferred.promise;

    }
  }
});


//Service de loading
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


//Service de  capture  et upload photo
function photoService($http,$q,$cordovaCamera,$cordovaFileTransfer){

  //capture
 	this.takePhoto = function(){
    
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      return $cordovaCamera.getPicture(options)


    },
    //upload sur le server
    this.uploadPhoto = function(response){

      var deferred = $q.defer();
    	var server = "http://shazoom.alwaysdata.net/upload.php";
    	var trustAllHosts = true;
   	 	var options = new FileUploadOptions();
   	 	options.fileKey = "file";
   	 	options.fileName = response.substr(response.lastIndexOf('/') +1);
   	 	options.mimeType = "image/jpeg";
   	 	options.chunkedMode = false;

      $cordovaFileTransfer.upload(server, response, options, trustAllHosts)
        .then(function(result) {
            deferred.resolve(options.fileName);

          }, function(err) {
            deferred.reject(err);
            alert('une erreur est survenu lors de l\'upload')

          }, function (progress) {
            // constant progress updates
          });
          return deferred.promise
    }
	}
