
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from a file

const dbUrl = process.env.MONGODB_URI; // Get the MongoDB URI from the environment variables
// Connect to the MongoDB database with the provided URI
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }) 
    .then(() => console.log("Connected to the Database")) 
    .catch(err => console.error("Could not connect to Database", err)); 

module.exports = mongoose; 