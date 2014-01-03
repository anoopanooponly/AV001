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
    /*$scope.like = function(i) {
        $scope.posts[i].likes.push(user._id);
        $scope.posts[i].$update(function() {
            //$location.path('posts/' + post._id);
        });
    };*/
}]);

angular.module('mean.posts').controller('LikeController', ['$scope', '$routeParams', '$location', 'Global', 'Like', function ($scope, $routeParams, $location, Global, Like) {
    $scope.global = Global;
    $scope.like = function(post) {
        if (post) {
            var like = new Like();
            like.likeInd = true;
            like.postId = post._id;
            like.$like(function(res) {
                if(res.err==null)
                    post.likes.push(user._id);
            });
        }
    };
    $scope.unlike = function(post) {
        if (post) {
            var like = new Like();
            like.likeInd = false;
            like.postId = post._id;
            like.$like(function(res) {
                if(res.err==null)
                    post.likes.slice(post.likes.lastIndexOf(user._id));
            });
        }
    };
}]);