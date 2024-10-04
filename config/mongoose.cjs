
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from a file

const dbUrl = process.env.MONGODB_URI; // Get the MongoDB URI from the environment variables

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to the MongoDB database with the provided URI
    .then(() => console.log("Connected to the Database")) // Log a success message when connected to the database
    .catch(err => console.error("Could not connect to Database", err)); // Log an error message if there's a problem connecting to the database

module.exports = mongoose; // Export the mongoose library