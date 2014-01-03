//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/articles', {
            templateUrl: 'views/articles/list.html'
        }).
        when('/articles/create', {
            templateUrl: 'views/articles/create.html'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'views/articles/edit.html'
        }).
        when('/posts', {
            templateUrl: 'views/posts/list.html'
        }).
        when('/posts/create', {
            templateUrl: 'views/posts/create.html'
        }).
        when('/posts/:postId/edit', {
            templateUrl: 'views/posts/edit.html'
        }).
        when('/posts/:postId', {
            templateUrl: 'views/posts/view.html'
        }).
        when('/profile/public', {
            templateUrl: 'views/profile/pubicProfile.html'
        }).
        when('/chat', {
            templateUrl: 'views/chat/chat.html'
        }).
        when('/settings', {
                templateUrl: 'views/settings/settings.html'
        }).
        when('/articles/:articleId', {
            templateUrl: 'views/articles/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix("!");
    }
]);