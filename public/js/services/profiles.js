//Articles service used for articles REST endpoint
angular.module('mean.profiles').factory("Profile", ['$resource', function($resource) {
    return $resource('publicProfile', {
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);