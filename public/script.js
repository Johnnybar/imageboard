// var more = $("#more");

var imageboard = angular.module('imageboard', ["app.routes", "ui.router"]);

//__________DISPLAY THE IMAGES


imageboard.controller('images', ($scope, $http, $window) => {
    getImages();
    $scope.message = 'Here are the images:';

    function getImages(){
        $http.get("/images").then(function(resp) {//This script gets the json file (containing
            //the references to the images we got from the db) that is currently being sent to
            // '/images' and adds it to the scope
            $scope.images = resp.data;
            $scope.limit = 4;
            $scope.limitUp = function(){
                $scope.limit +=4;
            };
            $scope.title = '';
            $scope.user = '';
            $scope.file = {};
            $scope.desc = '';
        });
    }

    $scope.submit = function(){
        var file = $('input[type="file"]').get(0).files[0];
        var title = $scope.title;
        var user = $scope.user;
        var desc = $scope.desc;

        var formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('user', user);
        formData.append('desc', desc);

        $http({
            url: '/upload',
            method: 'POST',
            data: formData,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(() => {
            getImages();
        });
    };
});

imageboard.controller('photos', ($scope, $http, $location)=>{
    $http.get('/singleImg/'+ $location.path().split('/').pop()).then((resp)=>{
        $scope.clickedImg = resp.data[0];
        console.log($scope.clickedImg);
    });
});

imageboard.controller('comments', ($scope, $http, $stateParams, $location, $window)=>{

    $scope.limit =4;
    $scope.limitUpComments = function(){
        $scope.limit +=4;
    };

    $scope.submitComment = function(){
        var username = $scope.username;
        var comment = $scope.comment;
        console.log('these are the username and comment ',comment, username);

        $http({
            url: '/comment/'+ $stateParams.imgId,
            method: 'POST',
            data: {comment:comment,
                username:username},
        })
            .then(() => {
                $window.location.reload();
            });
    };
    $http.get("/comment/"+ $location.path().split('/').pop()).then(function(resp) {
        $scope.comments = resp.data;

    });
});
