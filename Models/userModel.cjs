const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    maxLevel: {
        type: Number,
        default: 0 
    },
    results: [
        {
            score: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});
const User = mongoose.model('User', userSchema);

module.exports  = {User};