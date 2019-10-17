const mongoose = require("mongoose");

const ParagonSchema = new mongoose.Schema({
    file: String,
    description: String,
    author: String,
    id: String,
    day: String
}, { timestamps: true});

const Paragon = mongoose.model("paragon", ParagonSchema);

module.exports = Paragon;