// Import necessary modules
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const ejsMate = require("ejs-mate");
const path = require("path");
const User = require("./Models/userModel.cjs");
const authRoutes = require("./routes/auth-routes.cjs");
const mongoose = require("./config/mongoose.cjs");

require("dotenv").config(); // Load environment variables from .env file

// Set up EJS as the view engine with EJS Mate for layout support
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

// Set up port and database URL from environment variables
const port = process.env.PORT || 8080;
const dbUrl = process.env.MONGODB_URI;

// Routes
app.get("/", (req, res) => {
  res.render("register"); // Redirect to login page from root URL
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.use("/", authRoutes);

// Error handling for 404 (Page Not Found) for undefined routes
app.use((req, res, next) => {
  res
    .status(404)
    .render("error", { errorStatus: 404, errorMessage: "Page Not Found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
