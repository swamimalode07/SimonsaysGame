const mongoose = require('mongoose');
require('dotenv').config(); 

const dbUrl = process.env.MONGODB_URI ;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to the Database"))
    .catch(err => console.error("Could not connect to Database", err));

module.exports = mongoose;
