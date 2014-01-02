//Articles service used for articles REST endpoint
angular.module('mean.posts').factory("Post", ['$resource', function($resource) {
    return $resource('posts/:postId', {
        postId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);