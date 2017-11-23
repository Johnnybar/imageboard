var imageboard = angular.module('imageboard', ["app.routes"]);

//__________DISPLAY THE IMAGES


imageboard.controller('images', ($scope, $http) => {
    $scope.message = 'Here are the images:';
    $http.get("/images").then(function(resp) {//This script gets the json file (containing
        //the references to the images we got from the db) that is currently being sent to
        // '/images' and adds it to the scope

        $scope.images = resp.data;


        $scope.title = 'Title';
        $scope.user = 'User Name';
        $scope.file = {};
        $scope.desc = 'Decription';

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
            })
                .then(() => {
                    setTimeout(()=>{
                        console.log('YOOAOA');
                        $http.get('/images')
                            .then((resp)=>{
                                $scope.images = resp.data;
                            });
                    }, 3500);

                });
        };
    });
});

imageboard.controller('photos', ($scope, $http, $location)=>{
    $http.get('/singleImg/'+ $location.path().split('/').pop()).then((resp)=>{
        $scope.clickedImg = resp.data[0];
        console.log($scope.clickedImg);
    });
});


// setTimeout(()=>{
//     $http.get('/images')
//         .then((res)=>{
//             $scope.images = res.data;
//         });
// }, 100);
