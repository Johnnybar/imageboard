var imageboard = angular.module('imageboard', ["app.routes", "ui.router", 'app.nav']);
location.hash = '/home';


//Display images

imageboard.controller('images', ($scope, $http) => {

  $scope.limit = 5;
  $scope.limitUp = function () {    
    $scope.limit += 10;
    getImages()
  };

  let currentImages =[];
  function getImages() {
    $http.get("/images").then(function (resp) {
      currentImages = currentImages.concat(JSON.parse(resp.data).results.slice(0, $scope.limit));
      $scope.images =  currentImages
      $scope.title = '';
      $scope.user = '';
      $scope.file = {};
      $scope.desc = '';
    });
  } 
  
  $scope.submit = function () {
    alert('Pic submit disabled in demo mode', 'ok');
  };
  getImages();
});

imageboard.controller('photos', ($scope, $http, $location) => {
  let str = $location.path().split('/').pop()


  $http.get('/singleImg/' + $location.path().split('/').pop()).then((resp) => {
    let src = resp.data.replace(/~2F/g, "/");
    $scope.clickedImg = src
  });
});

let currentDescription;
imageboard.controller('comments', ($scope, $http, $stateParams, $location) => {

  $scope.limit = 4;
  $scope.limitUpComments = function () {
    $scope.limit += 4;
  };

  $scope.submitComment = function () {

    const newCommentObj = {
      name: $scope.username,
      comment: $scope.comment,
      description: currentDescription
    }

    $scope.comments = $scope.comments.concat(newCommentObj);
    var temp = $scope.comments[0];
    $scope.comments[0] = $scope.comments[$scope.comments.length - 1];
    $scope.comments[$scope.comments - 1] = temp;
    
    $scope.username = '';
    $scope.comment = ''
    // alert('Comment submit disabled in demo mode', 'ok');
  };

  function getComments() {
    let randomText = [];
    $http.get("https://litipsum.com/api/15").then(function (resp) {
      
      for (const char in resp.data) {
        if (resp.data[char] === '.' && char > 5) {
          randomText = resp.data.slice(0, char)
          break;
        }
      }
      
    }).then(() => {
      
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
          obj.name = obj.name[0] ? obj.name[0].toUpperCase() + obj.name.slice(1) : 'James'
          obj.description = randomText + '.'
          currentDescription = obj.description;
          obj.comment = commentArr[i].slice(0, commentArr[i].indexOf('.')).replace(/[^a-zA-Z ]/g, "")
          allCommentObj.push(obj)
        }
        
        $scope.comments = allCommentObj;
        
      });
    })
  }
  getComments();
});