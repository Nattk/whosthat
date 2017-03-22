// Création du module controller
angular.module('whosthat.controllers', ['ngCordova',])
// Création du controller home
.controller('HomeCtrl', function($scope,loadingService,photoService,$cordovaFileTransfer,FaceCompare,WikiFactory,$rootScope,$state) {
 // lancement du loading a l'ouverture de l'app
  loadingService.show();
// fermeture de loading lorsque la platform est ready
  ionic.Platform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      loadingService.hide();
});

// lancement de la fonction tout() qui lance tout le process
$scope.tout= function(){
  photoService.takePhoto().then(function(response){
      photoService.uploadPhoto(response);
    });
}

$scope.name = "Jean Dujardin";
$scope.infos = {};
$scope.wiki= function(){
  WikiFactory.get($scope.name).then(function(response){
      $rootScope.infos = response;
      console.log($rootScope.infos)
      $state.go('results');
    });
}

$scope.compare= function(){
  FaceCompare.compare().then(function(response){
      FaceCompare.confidenceCheck(response);
  });
};


})


.controller('ResultsCtrl', function($scope,$cordovaCamera,$rootScope,$cordovaFileTransfer,$cordovaInAppBrowser) {
  $scope.openLink = function(){
    $scope.articleName = $rootScope.infos.title.replace(' ','_');
    $scope.link = "https://fr.wikipedia.org/wiki/"+$scope.articleName;
    console.log($scope.link)
    var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
      };
      document.addEventListener("deviceready", function () {

      $cordovaInAppBrowser.open($scope.link , '_blank', options)
        .then(function(event) {
          // success
        })
        .catch(function(event) {
          // error
        });

        }, false);
      };

});
