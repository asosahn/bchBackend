const mongoose = require("mongoose");

const FilesSchema = new mongoose.Schema({
    encoding: String,
    fieldname: String,
    mimetype: String,
    originalname: String,
    size: Number
}, { timestamps: true});

const Files = mongoose.model("File", FilesSchema);

module.exports = Files;


