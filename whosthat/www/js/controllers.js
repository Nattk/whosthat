// Création du module controller
angular.module('whosthat.controllers', ['ngCordova'])
// Création du controller home
.controller('HomeCtrl', function($scope,loadingService,photoService,$cordovaFileTransfer,FaceCompare,WikiFactory,$rootScope,$state) {
  $scope.inter = false;
 // lancement du loading a l'ouverture de l'app
  loadingService.show();
  $scope.inter = true;

// fermeture de loading lorsque la platform est ready
  ionic.Platform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      loadingService.hide();
      $scope.inter = false;

});

// lancement de la fonction tout() qui lance tout le process
$scope.tout= function(){
  photoService.takePhoto().then(function(response){
      $scope.inter = true;
      loadingService.show();

      photoService.uploadPhoto(response).then(function(result){
        $scope.compare(result);
      })
    });
}

$scope.compare= function(result){
  FaceCompare.compare(result).then(function(response){
      FaceCompare.confidenceCheck(response).then(function(matches){
        alert('matches'+JSON.stringify(matches));
        var matchName = matches[0].name;
        $rootScope.url ="http://shazoom.alwaysdata.net/ref/"+matchName;
        alert('matchName'+matchName);
          for(var i=0; i<matchName.length;i++) {
                if (matchName[i] === "_"){
                matchName =  matchName.split("");
                matchName = matchName.splice(0, i);
                matchName =  matchName.join('');
                alert(matchName);
                }
            }
        matchName = matchName.replace(/-/g,'_');
        $scope.name = matchName;
        alert($scope.name);
        $scope.wiki();
      })
  });
};
$scope.infos = {};
$scope.wiki= function(){
  alert("wiki"+$scope.name)
    var arr = [];
    for(var i=0; i<$scope.name.length;i++) {
        if ($scope.name[i] === "_") arr.push(i+1);
    }

     $scope.name =  $scope.name.split("");
    for(var i = 0; i <  $scope.name.length; i++){
        //CHANGE HERE
        if(arr.indexOf(i) != -1){
                          //^^ change this
             $scope.name[i] =  $scope.name[i].toUpperCase();
        }
    }
     $scope.name =  $scope.name.join('');
     $scope.name = $scope.name.charAt(0).toUpperCase()+ $scope.name.slice(1);

  WikiFactory.get($scope.name).then(function(response){
      $rootScope.infos = response;
      $scope.inter = false;
      loadingService.hide();
      $state.go('results',{name : $scope.name,url :$scope.url} );
    });
}

})


.controller('ResultsCtrl', function($scope,$rootScope,$cordovaInAppBrowser,$state,$stateParams) {
  $scope.image =$rootScope.url;
  $scope.openLink = function(){
    $scope.articleName = $stateParams.name;
    $scope.link = "https://fr.wikipedia.org/wiki/"+$scope.articleName;
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
