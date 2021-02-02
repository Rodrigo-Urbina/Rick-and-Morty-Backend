const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    getAllUsers,
    alreadyExists,
    postUser,
    loginUser,
    updateUser,
    deleteUser,
    getFavorites
}

// Bcrypt configuration
const saltRounds = 10;

async function getAllUsers() {
    const users = await User.find();
    return users;
}

async function alreadyExists(email){
    const found = await User.find({ email: email });

    if(found.length !== 0){
        return true;
    } else {
        return false;
    }
}

async function postUser(user) {
  const savedUser = await user.save();
  return savedUser;
}

async function loginUser(user) {
    const savedUser = await User.find({ email: user.email })
    if(savedUser.length < 1){
        return "Auth Failed";
    } else {
        return savedUser;
    }
}

async function updateUser(email, body) {
    const user = await User.findOneAndUpdate({ email: email }, { $set: body });
    return user;
}

async function deleteUser(email) {
    const user = await User.findOneAndDelete({ email: email });
    return user;
}

async function getFavorites(email) {
    const user = await User.findOne({ email: email });
    return user.favorites;
}