const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"] },
    time: String,
    musicType: String
}, { timestamps: true});

const Song = mongoose.model("Song", SongSchema);

module.exports = Song;