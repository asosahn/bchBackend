const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"] },
    band: { type: Boolean, default: false},
    description: { type: String, required: [true, "description is required"]  },
    image: String
}, { timestamps: true});

const Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;