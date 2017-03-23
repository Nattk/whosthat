// Création du module controller
angular.module('whosthat.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope,loadingService,photoService,$cordovaFileTransfer,FaceCompare,WikiFactory,$rootScope,$state) {
  $scope.inter = false;
 // lancement du loading a l'ouverture de l'app
  loadingService.show();
// fermeture de loading lorsque la platform est ready
  ionic.Platform.ready(function(){
// will execute when device is ready, or immediately if the device is already ready.
  loadingService.hide();
});

// lancement de la fonction capture() qui lance les services
$scope.capture= function(){
  photoService.takePhoto().then(function(response){
      loadingService.show();
      photoService.uploadPhoto(response).then(function(result){
        $scope.compare(result);
      })
    });
}

//appel les factory de comparaison
$scope.compare= function(result){

  FaceCompare.compare(result).then(function(response){
      FaceCompare.confidenceCheck(response).then(function(matches){
        //nom de l'acteur non traité = prenom-nom-id.jpg
        var matchName = matches[0].name;
        //Photo de l'acteur sur le serveur
        $rootScope.url ="http://shazoom.alwaysdata.net/ref/"+matchName;

        //traitement de la string du nom
          for(var i=0; i<matchName.length;i++) {
                if (matchName[i] === "_"){
                matchName =  matchName.split("");
                matchName = matchName.splice(0, i);
                matchName =  matchName.join('');
                }
            }
        matchName = matchName.replace(/-/g,'_');
        $scope.name = matchName;
        //appel des fonctions lié à l'api mediaWiki
        $scope.wiki();
      })
  });
};

$scope.infos = {};

//appel API MediaWiki
$scope.wiki= function(){
    //traitement de la string
    var arr = [];
    for(var i=0; i<$scope.name.length;i++) {
        if ($scope.name[i] === "_") arr.push(i+1);
    }

     $scope.name =  $scope.name.split("");
    for(var i = 0; i <  $scope.name.length; i++){
        if(arr.indexOf(i) != -1){

             $scope.name[i] =  $scope.name[i].toUpperCase();
        }
    }
     $scope.name =  $scope.name.join('');
     $scope.name = $scope.name.charAt(0).toUpperCase()+ $scope.name.slice(1);

  // appel api avec la string traité
  WikiFactory.get($scope.name).then(function(response){
      $rootScope.infos = response;
      loadingService.hide();
      $state.go('results',{name : $scope.name,url :$scope.url} );
    });
}

})


.controller('ResultsCtrl', function($scope,$rootScope,$cordovaInAppBrowser,$state,$stateParams) {
  //récuperation url de la photo de l'acteursur le serveur
  $scope.image =$rootScope.url;

  $scope.openLink = function(){
    $scope.articleName = $stateParams.name;
    $scope.link = "https://fr.wikipedia.org/wiki/"+$scope.articleName;
    var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
      };
      //Ouverture du browser dans l'application
      document.addEventListener("deviceready", function () {
      $cordovaInAppBrowser.open($scope.link , '_blank', options)
        .then(function(event) {
          // success
        })
        .catch(function(event) {
          // error
          alert(event);
        });

        }, false);
      };

});
