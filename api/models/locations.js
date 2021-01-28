const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    id: Number,
    name: String,
    type: String,
    dimension: String,
    residents: [String],
    url: String,
    created: String
});

module.exports = mongoose.model('Location', LocationSchema);