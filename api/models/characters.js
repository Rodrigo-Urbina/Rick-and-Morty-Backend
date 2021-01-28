const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String,
  species: String,
  type: String,
  gender: String,
  //origin: { type: mongoose.Schema.ObjectId, ref: 'Location' },
  origin: {
      "name": String,
      "url": String
  },
  //location: { type: mongoose.Schema.ObjectId, ref: 'Location' },
  location: {
      "name": String,
      "url": String
  },
  image: String,
  episode: [String],
  url: String,
  created: String,
});

module.exports = mongoose.model("Character", CharacterSchema);
