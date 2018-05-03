angular.module('app.routes', ['ui.router'])

    .config(function($stateProvider){
        $stateProvider
            .state('home',{
                url: '/home',
                views: {
                    'main': {
                        templateUrl: 'views/main.html'
                    }
                }
            })

            .state('singleImg',{
                url: '/singleImg/:imgId',
                views: {
                    'main': {
                        templateUrl: 'views/templates/imgView.html',
                        controller: function ($stateParams) {
                            // console.log($stateParams);
                            return $stateParams;
                        }
                    },
                }
            });
    });
