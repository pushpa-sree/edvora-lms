const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// IMPORTANT: Configure to use email as username
userSchema.plugin(passportLocalMongoose, { 
    usernameField: 'email',
    passwordField: 'password'
});

module.exports = mongoose.model('User', userSchema);