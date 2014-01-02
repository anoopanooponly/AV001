/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


var PostSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    likes:[{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    comments:[Comment],
    images:[Image],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

var Comment = new Schema({
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    likes:[{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

var Image = new Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },
    desc: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    likes:[{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    comments:[Comment],
    created: {
        type: Date,
        default: Date.now
    }
});


/**
 * Validations
 */
PostSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
PostSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

mongoose.model('Post', PostSchema);