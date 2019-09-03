const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"] },
    band: { type: Boolean, default: false},
    description: String,
    image: String
}, { timestamps: true});

const Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;