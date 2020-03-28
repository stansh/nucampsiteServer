const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); //adds username, password fields to the docuemnt along with hashing and salting
const Schema = mongoose.Schema;

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose); //provides authenticate() method

module.exports = mongoose.model('User', userSchema);