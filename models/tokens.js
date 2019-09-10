const mongoose = require("mongoose");

const TokensSchema = new mongoose.Schema({
    token: String,
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    refreshToken: String
}, { timestamps: true});

const Tokens = mongoose.model("Token", TokensSchema);

module.exports = Tokens;