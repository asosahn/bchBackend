const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'firstName is required'] },
    lastName: { type: String , required: [true, 'lastName is required'] },
    email: { type: String },
    gender: { type: String, enum: ["m", "f"] },
    refreshToken: String,
    hash: String,
    salt: String,
    username: { type: String, unique: true, required: [true, 'username is required'] },
    password: String,
    fullName: String,
    enabled: { type: Boolean, default: true },
    auth: {
        token: String,
        exp: Date,
        refreshToken: String
    },
    roles: [ {type: String, enum: ['admin', 'user'] }]
}, { timestamps: true });



userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha1").toString("hex");
    return this;
};

userSchema.pre("save", function save(next) {
    const user = this;
    if (user.isModified("firstName") || user.isModified("lastName")) {
        user.fullName = `${user.firstName} ${user.lastName}`;
    }
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.isValidPassword = function (password, cb) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha1").toString("hex");
    cb(undefined, hash === this.hash);
};

userSchema.methods.generateJwt = (userModel) => {
    const user = userModel.toJSON();
    delete user.password;
    delete user.hash;
    delete user.salt;
    const user_ = {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        fullName: `${ user.firstName } ${ user.lastName }`,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles
    };
    const privateKey = "BCH ANGULARJS";
    return jwt.sign({ user: user_ }, privateKey, { expiresIn: "30m" });
};

const User = mongoose.model("User", userSchema);

module.exports = User;