angular.module('app.routes', ['ui.router'])

    .config(function($stateProvider){
        $stateProvider
            .state('home',{
                url: '/',
                views: {
                    'main': {
                        templateUrl: 'views/main.html'
                    }
                }
            })

            .state('about',{
                url: '/about',
                views: {
                    'main': {
                        templateUrl: 'views/about.html'
                    },
                    '@about': {
                        template: '<p>I targeted the unnamed view in about.html</p>'
                    }
                }
            });
    });
