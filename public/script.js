var imageboard = angular.module('imageboard', ["app.routes", "ui.router", 'app.nav']);
location.hash = '/home';

//Display images

imageboard.controller('images', ($scope, $http) => {
  getImages();
  $scope.message = 'Here are the images:';

  function getImages() {
    $http.get("/images").then(function(resp) {
      $scope.images = resp.data;
      $scope.limit = 10;
      $scope.limitUp = function() {
        $scope.limit += 10;
      };
      $scope.title = '';
      $scope.user = '';
      $scope.file = {};
      $scope.desc = '';
    });
  }

  $scope.submit = function() {
    alert('Pic submit disabled in demo mode', 'ok');
  };
});

imageboard.controller('photos', ($scope, $http, $location) => {
  $http.get('/singleImg/' + $location.path().split('/').pop()).then((resp) => {
    $scope.clickedImg = resp.data[0];
  });
});

imageboard.controller('comments', ($scope, $http, $stateParams, $location) => {

  $scope.limit = 4;
  $scope.limitUpComments = function() {
    $scope.limit += 4;
  };

  $scope.submitComment = function() {
    alert('Comment submit disabled in demo mode', 'ok');
  };

  function getComments() {
    $http.get("/comment/" + $location.path().split('/').pop()).then(function(resp) {
      $scope.comments = resp.data;
    });
  }
  getComments();
});
