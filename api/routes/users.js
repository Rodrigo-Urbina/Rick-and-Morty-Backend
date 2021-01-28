const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Local Imports
const User = require("../models/users");
const Controller = require("../controllers/users");

// Bcrypt configuration
const saltRounds = 10;

// User Routes

// Get all users
router.get("/", async (req, res, next) => {
  const response = await Controller.getAllUsers();
  res.json(response);
});

// Register a new User
router.post("/signup", async (req, res, next) => {
  const validator = new User(req.body);
  let error = validator.validateSync();

  if(error){
    return res.status(400).json({error: "Bad request", "status": 400});
  }
  
  const duplicate = await Controller.alreadyExists(req.body.email);

  if(duplicate) {
    return res.json({
      message: "This email has already been registered",
      status: 409
    })
  }

  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    if (err) {
      return res.json({
        error: err,
      });
    } else {
      let user = new User({
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        cellphone: req.body.cellphone,
        favorites: []
      });
      let savedUser = await Controller.postUser(user);
      res.json(savedUser);
    }
  });

});

// Login with Credentials
router.post("/login", async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (user.length === 0) {
    return res.json({
      error: "User not found",
      status: 404
    });
  }
  bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    if (err) {
      return res.json({
        error: err,
      });
    }

    if (result) {

      const token = jwt.sign({
        id: user[0]._id,
        email: user[0].email, 
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        cellphone: user[0].cellphone,
        favorites: user[0].favorites
      }, process.env.SECRET_KEY, {
        expiresIn: "1h"
        // expiresIn: "15m"
      })

      return res.json({
        message: "Auth Successful",
        token: token
      });
    }

    res.json({
      error: "Auth Failed",
      status: 401
    });
  });
});

// Update user information
router.patch("/:email", async (req, res, next) => {
  const user = await Controller.updateUser(req.params.email, req.body);
  res.json(user);
});

// Update user's password
router.patch("/password/:email", async(req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    if (err) {
      return res.json({
        error: err,
      });
    } else {
      let newPass = { 
        password: hash
      };
      let savedPass = await Controller.updateUser(req.params.email, newPass);
      res.json(savedPass);
    }
  });
})

// Delete user
router.delete("/:email", async (req, res, next) => {
  const user = await Controller.deleteUser(req.params.email);
  res.json(user);
});

// Get User's Favorites
router.get("/favorites/:email", async(req, res) => {
  const favorites = await Controller.getFavorites(req.params.email);
  res.json(favorites);
})

module.exports = router;
