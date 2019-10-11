const mongoose = require("mongoose");

const ParagonDaySchema = new mongoose.Schema({
    title: String,
    id: String,
    short: String
}, { timestamps: true});

const ParagonDay = mongoose.model("Paragonday", ParagonDaySchema);

module.exports = ParagonDay;