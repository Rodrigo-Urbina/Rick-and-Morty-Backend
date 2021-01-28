const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

// Database connection
mongoose.connect("mongodb://localhost/userstest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB database...");
});

// Morgan middleware
app.use(morgan("dev"));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Allowance
app.use(cors());

// get Basic Routes
app.get("/", (req, res) => {
  const urls = {
    "characters": "http://localhost:3000/characters",
    "episodes": "http://localhost:3000/episodes",
    "locations": "http://localhost:3000/locations",
    "users": "http://localhost:3000/users"
  }

  res.json(urls);
})

// Import Routes
const userRoutes = require("./api/routes/users");
const productRoutes = require("./api/routes/products");
const characterRoutes = require("./api/routes/characters");
const episodeRoutes = require("./api/routes/episodes");
const locationRoutes = require("./api/routes/locations");

// Middleware to implement User Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/characters", characterRoutes);
app.use("/episodes", episodeRoutes);
app.use("/locations", locationRoutes);

// Export the whole app into server.js
module.exports = app;
