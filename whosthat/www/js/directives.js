angular.module('whosthat')
// Création du controller home
.directive('loading', function() {
  return{
    restrict :'E',
    templateUrl: 'templates/loading.html'
  }

}
