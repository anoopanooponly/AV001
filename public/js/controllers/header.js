angular.module('mean.system').controller('HeaderController', ['$scope', 'Global','$location', function ($scope, Global,$location) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "link": "articles","selected" : "false"
    }, {
        "title": "New Article",
        "link": "articles/create","selected" : "false"
    }
        , {
            "title": "Posts",
            "link": "posts","selected" : "false"
        }

    ];
    
    $scope.isCollapsed = false;

    $scope.isActive = function(route) {
        route = '/' + route;
       console.log(route + '<>' + $location.path());
                return route === $location.path();
    }
}]);