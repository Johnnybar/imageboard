var imageboard = angular.module('imageboard', ["app.routes", "ui.router", 'app.nav']);
location.hash = '/home';

//Display images

imageboard.controller('images', ($scope, $http) => {


  getImages();
  $scope.message = 'Here are the images:';

  function getImages() {
    $http.get("/images").then(function (resp) {
      // console.log(JSON.parse(resp.data));

      $scope.images = JSON.parse(resp.data).results
      $scope.seeds = JSON.parse(resp.data).info
      // $scope.imageSeeds= JSON.parse(resp.data).info
      $scope.limit = 20;
      // let str = $scope.images
      // let obj = JSON.parse(str)
      // console.log('in getimages in script', JSON.parse(resp.data));

      $scope.limitUp = function () {
        $scope.limit += 10;
      };
      $scope.title = '';
      $scope.user = '';
      $scope.file = {};
      $scope.desc = '';
    });
  }

  $scope.submit = function () {
    alert('Pic submit disabled in demo mode', 'ok');
  };
});

imageboard.controller('photos', ($scope, $http, $location) => {
  let str = $location.path().split('/').pop()


  $http.get('/singleImg/' + $location.path().split('/').pop()).then((resp) => {
    let src = resp.data.replace(/~2F/g, "/");
    $scope.clickedImg = src
  });
});

imageboard.controller('comments', ($scope, $http, $stateParams, $location) => {

  $scope.limit = 4;
  $scope.limitUpComments = function () {
    $scope.limit += 4;
  };

  $scope.submitComment = function () {
    alert('Comment submit disabled in demo mode', 'ok');
  };

  function getComments() {
    $http.get("https://litipsum.com/api/15/p/json").then(function (resp) {
      let text = resp.data.text.join()

      let allCommentObj = []
      let commentArr = []

      let parArr = text.split('<p>', 10)
      for (const arr of parArr) {
        let newArr = arr.split("</p>").shift()
        commentArr.push(newArr)
      }

      for (let i = 1; i < commentArr.length; i++) {
        let obj = {}

        obj.name = commentArr[i].slice(8, 13).replace(/[^a-zA-Z0-9]/g, '').split().reverse().join() + commentArr[i].slice(20, 27).replace(/[^a-zA-Z0-9]/g, '')
        obj.name = obj.name[0].toUpperCase() + obj.name.slice(1)
        obj.description = commentArr[i < 3 ? 2 : 4].slice(0, 16).toUpperCase().replace(/[^a-zA-Z ]/g, "")
        obj.comment = commentArr[i].slice(0, commentArr[i].indexOf('.')).replace(/[^a-zA-Z ]/g, "")
        allCommentObj.push(obj)
      }
      // console.log(allCommentObj);
      
      $scope.comments = allCommentObj;
    });
  }
  getComments();
});