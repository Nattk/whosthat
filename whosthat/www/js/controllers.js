angular.module('whosthat.controllers', ['ngCordova',])

.controller('HomeCtrl', function($scope,loadingService,photoService,$cordovaFileTransfer,FaceCompare,WikiFactory,$rootScope,$state) {

  loadingService.show();

  ionic.Platform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      loadingService.hide();
});


$scope.tout= function(){
  photoService.takePhoto().then(function(response){
      photoService.uploadPhoto(response);
    });
}


$scope.compare= function(){
  FaceCompare.compare().then(function(response){
      FaceCompare.confidenceCheck(response).then(function(result){
        $scope.name = result;
        $scope.wiki();
      })
      $scope.name = FaceCompare.confidenceCheck(response)
  });
};
$scope.infos = {};
$scope.wiki= function(){
   $scope.name = $scope.name.replace(/ /g, '_');
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
      $state.go('results',{name : $scope.name} );
    });
}

})


.controller('ResultsCtrl', function($scope,$rootScope,$cordovaInAppBrowser,$state,$stateParams) {
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
