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

angular.module('mean.posts').factory("Like", ['$resource', function($resource) {
    return $resource('posts/:postId/user/:userId/likeInd/:likeInd', {
        userId: user._id,
        likeInd: '@likeInd',
        postId: '@postId'
    }, {
        like: {
            method: 'PUT'
        },
        unlike: {
            method: 'PUT'
        }
    });
}]);