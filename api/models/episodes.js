const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    air_date: String,
    episode: String,
    characters: [String],
    url: String,
    created: String
});

module.exports = mongoose.model('Episode', EpisodeSchema);