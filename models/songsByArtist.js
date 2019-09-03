const mongoose = require("mongoose");

const SongByArtistSchema = new mongoose.Schema({
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
}, { timestamps: true});

const SongsByArtist = mongoose.model("SongsByArtist", SongByArtistSchema);

module.exports = SongsByArtist;