const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const User = require("./Models/userModel.cjs");
const authRoutes = require("./routes/auth-routes.cjs");
const mongoose  = require("./config/mongoose.cjs");

require('dotenv').config(); 
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 8080;

app.get('/login', (req, res) => {
    res.render('login');  
});

app.use('/',authRoutes);

app.get("/*", (req, res) => {
    res.redirect("login");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
