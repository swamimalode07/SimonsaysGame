// Import the mongoose library
const mongoose = require('mongoose');

// Define a schema for the User model
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

// Export the User model for use in other parts of the application
module.exports = { User };
