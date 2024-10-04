const mongoose = require('mongoose');

// Schema for the User model
const userSchema = new mongoose.Schema({
    // The username field is a string, required, and must be unique
    username: {
        type: String,
        required: true,
        unique: true
    },
    // The maxLevel field is a number with a default value of 0
    maxLevel: {
        type: Number,
        default: 0 
    }
});

// Create a User model using the userSchema
const User = mongoose.model('User', userSchema);

module.exports = { User };
