angular.module('mean.posts').controller('PostController', ['$scope', '$routeParams', '$location', 'Global', 'Post', function ($scope, $routeParams, $location, Global, Post) {
    $scope.global = Global;

    $scope.create = function() {
        var post = new Post({
            title: this.title,
            content: this.content
        });
        post.$save(function(response) {
            $location.path("posts/" + response._id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(post) {
        if (post) {
            post.$remove();

            for (var i in $scope.posts) {
                if ($scope.posts[i] == post) {
                    $scope.posts.splice(i, 1);
                }
            }
        }
        else {
            $scope.post.$remove();
            $location.path('posts');
        }
    };

    $scope.update = function() {
        var post = $scope.post;
        if (!post.updated) {
            post.updated = [];
        }
        post.updated.push(new Date().getTime());

        post.$update(function() {
            $location.path('posts/' + post._id);
        });
    };

    $scope.find = function() {
        Post.query(function(posts) {
            $scope.posts = posts;
        });
    };

    $scope.findOne = function() {
        Post.get({
            postId: $routeParams.postId
        }, function(post) {
            $scope.post = post;
        });
    };

    $scope.like = function(i) {
        /*Post.get({
            postId: $routeParams.postId
        }, function(post) {
            $scope.post = post;
        });*/
        $scope.posts[i].likes.push(user._id);
    };
}]);