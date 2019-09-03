const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"] },
    lastName: { type: String, required: [true, "lastName is required"] },
    birthDate: Date,
    address: String,
    id: String,
    fullName: String,
    user: String,
    password: String,
    gender: String
}, {timestamps: true});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
