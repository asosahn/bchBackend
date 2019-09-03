const mongoose = require("mongoose");

const BandSchema = new mongoose.Schema({
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
    members: [
        {
            name: String,
            instrument: String
        }
    ]
}, { timestamps: true});

const Band = mongoose.model("Band", BandSchema);

module.exports = Band;