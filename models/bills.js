const mongoose = require("mongoose");

const billsSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    bills: [{
        id: String,
        bill: Number
    }]
}, { timestamps: true});

const Bill = mongoose.model("Bill", billsSchema);

module.exports = Bill;
