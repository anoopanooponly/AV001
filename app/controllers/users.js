/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('underscore');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                errors: err.errors,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

exports.publicProfile = function(req, res) {
    User.findOne({
        _id: req.user._id
    }).exec(function(err, result) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            if(result.publicProfileData!=null)
                res.jsonp(result.publicProfileData);
        }
    });
//    res.jsonp(req.user.publicProfile);
};

/**
 * Update a public profile
 */
exports.updatePublicProfile = function(req, res) {

    var publicProfile = req.body;

    //publicProfile = _.extend(publicProfile, req.body);

    User.update({_id: req.user._id}, {$set: {
        publicProfileData: publicProfile
    }}, function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        }
        else
            res.redirect('/');
        });
};
