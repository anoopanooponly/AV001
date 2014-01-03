/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('underscore'),
    authTypes = ['github', 'twitter', 'facebook', 'google'];


/**
 * User Schema
 */

var UserSchema = new Schema({
    name: String,
    email: String,
    username: {
        type: String,
        unique: true
    },
    provider: String,
    hashed_password: String,
    salt: String,
    preferences: [Preferences],
    publicProfile: [PublicProfile],
    professionalProfile: [ProfessionalProfile],
    extendedPublicProfile: [ExtendedPublicProfile],
    facebook: {},
    twitter: {},
    github: {},
    google: {}
});

var PublicProfile = new Schema({
    aboutMe:String,
    displayName: String,
    dateOfBirth:{
        type: Date
    },
    currentCity:String,
    nativeCity:String,
    currentAddress1:String,
    currentAddress2:String,
    currentZip:Number,
    address1:String,
    address2:String,
    state:String,
    nationality:String,
    zip:Number,
    gender:String,
    relationshipStatus:String,
    languages:[String],
    religion:String,
    mobilePhone:Number,
    landLine:Number,
    web:String,
    profilePicID:Number,
    lastUpdated:{
        type: Date
    }
});

var Preferences = new Schema({
    whoCanSeeYou:Number,
    profProfileInd:Boolean,
    extendedProfileInd: Number
});

var ProfessionalProfile = new Schema({
    aboutMe:String,
    openToHire:Boolean,
    noticePeriod: Number,
    experience:[Experience],
    qualifications:[Qualification],
    skills:[Skill],
    locationPreferences:[String]
});

var ExtendedPublicProfile = new Schema({
    familyName:String,
    caste:String,
    subCaste:String,
    star:String,
    birthTime:String,
    lookingFor:String,
    partnerPreferences:String
});

var Experience = new Schema({
    title:String,
    company:String,
    startDate:{type:Date},
    endDate:{type:Date},
    projects:[Project]
});
var Qualification = new Schema({
    course:String,
    status:String,
    institution:String,
    university:String,
    regNo:String,
    GPA:Number,
    startDate:{type:Date},
    endDate:{type:Date},
    projects:[Project]
});
var Skill = new Schema({
    name:String,
    months:Number
});
var Project = new Schema({
   name:String,
    company:String,
    startDate:{type:Date},
    endDate:{type:Date},
    status:String,
    role:String,
    description:String,
    technologiesUsed : String
});


/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

UserSchema.virtual('publicProfileData').get(function() {
    return this.publicProfile[0]});

UserSchema.virtual('publicProfileData').set(function(profileData) {
    this.publicProfile[0]=profileData});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('name').validate(function(name) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function(username) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

mongoose.model('User', UserSchema);