angular.module('app.nav', [])

    .directive('gtNav', function(){
        return {
            templateUrl: 'nav/nav.html',
            restrict: 'E',
            controller: function($scope){
                $scope.showClick = function(e){
                };
            }
        };
    });
