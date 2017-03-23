angular.module('whosthat.controllers', ['ngCordova',])

.controller('HomeCtrl', function($scope,loadingService,photoService,$cordovaFileTransfer,FaceCompare,WikiFactory,$rootScope,$state) {

  loadingService.show();

  ionic.Platform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      loadingService.hide();
});


$scope.tout= function(){
  photoService.takePhoto().then(function(response){
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
