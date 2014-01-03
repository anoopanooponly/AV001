/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    _ = require('underscore');


/**
 * Find article by id
 */
exports.post = function(req, res, next, id) {
    Post.load(id, function(err, post) {
        if (err) return next(err);
        if (!post) return next(new Error('Failed to load article ' + id));
        req.post = post;
        next();
    });
};

/**
 * Create a article
 */
exports.create = function(req, res) {
    var post = new Post(req.body);
    post.user = req.user;

    post.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                article: post
            });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var post = req.post;

    post = _.extend(post, req.body);

    post.save(function(err) {
        res.jsonp(post);
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var post = req.post;

    post.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.post);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Post.find().sort('-created').populate('user', 'name username').exec(function(err, posts) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(posts);
        }
    });
};

/**
 * Update a article
 */
exports.addLike = function(req, res) {
    if(req.params.likeInd=="true")
    {
    Post.update({_id:req.params.postId},{$push:{likes:req.params.userId}},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Successfully Liked");
        }
        res.jsonp({err:err});
    });
    }
    else
    {
        Post.update({_id:req.params.postId},{$pull:{likes:req.params.userId}},function(){
            if(err){
                console.log(err);
            }else{
                console.log("Successfully Unliked");
            }
            res.jsonp({err:err});
        });
    }
};