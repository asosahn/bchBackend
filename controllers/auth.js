const passport = require("../utils/passport");
const moment = require("moment-timezone");
const User = require("../models/user");
const mongoose = require("mongoose");
const randtoken = require("rand-token");
const path = require("path");
const UPLOAD_FILES = path.join(__dirname, "/../files");
const Files = require("../models/files");
const fs = require("fs");
const Tokens = require('../models/tokens');
const fsPromises = fs.promises;

const login = (req, res, next) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(403).json({ error: true, message: err });
      }

      if (!user) {
        return res.status(401).json(info);
      }

      //   const responseToken = {
      //     token: user.generateJwt(user)
      //   };
      if (user.auth && user.auth.token) {
        new Tokens({ token: user.auth.token, refreshToken: user.auth.refreshToken, user: user._id }).save();
      }
      user.auth = {
        ...user.auth,
        token: user.generateJwt(user),
        refreshToken: randtoken.uid(256),
        exp: moment()
          .add(2, "days")
          .toDate()
      };
      user
        .save()
        .then(savedUser => {
          const user_ = { ...savedUser.toJSON() };
          delete user_.hash;
          delete user_.salt;
          delete user_.password;
          //   responseToken.user = user_;
          res.json(user_);
        })
        .catch(err => {
          return res
            .status(403)
            .json({ error: true, message: err.message || err });
        });
    })(req, res, next);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const createUser = (req, res, next) => {
  try {
    const params = req.body;
    const user = new User(params);
    const token = user.generateJwt(user);
    const credentials = user.setPassword(user.password);
    user.auth = {
      token: token,
      refreshToken: randtoken.uid(256),
      exp: moment()
        .add(2, "days")
        .toDate()
    };
    user
      .save()
      .then(savedUser => {
        const user_ = { ...savedUser.toJSON() };
        delete user_.hash;
        delete user_.salt;
        delete user_.password;
        //   responseToken.user = user_;
        res.json(user_);
      })
      .catch(err => res.status(403).json({ err: err.toString() }));
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const logout = (req, res, next) => {
  try {
    const params = req.body;
    const user = req.payload && req.payload.user ? req.payload.user : undefined;
    // let promise = User.findOne(
    //   { refreshToken: params.refreshToken }
    // ).exec();
    // if (user) {
    //   promise = User.findOneAndUpdate(
    //     { _id: mongoose.Types.ObjectId(user._id) },
    //     { $set: { auth: {} } }
    //   ).exec();
    // }
    User.findOne(
      { 'auth.refreshToken': params.refreshToken }
    ).exec()
    .then(user => {
      if(!user) {
        return Promise.resolve(true);
      }
        new Tokens({
          token: user.auth.token,
          refreshToken: user.auth.refreshToken,
          user: user._id
        }).save()
      return User.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(user._id) },
          { $set: { auth: {} } }
        ).exec();
      })
      .then((result) => {
        res.json({ logout: true });
      })
      .catch(err => {
        res.status(403).json({ logout: false, error: err.toString() });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const refreshToken = (req, res, next) => {
  try {
    if (!req.body.refreshToken) {
      return res.status(403).json({ error: "refreshToken is required" });
    }
    const refreshToken = req.body.refreshToken;
    User.findOne({ "auth.refreshToken": refreshToken })
      .exec()
      .then(user => {
        if (!user) {
          throw Error("invalid refreshtoken");
        }
        const token = user.generateJwt(user);
        const refreshToken = randtoken.uid(256);
        user.auth = {
          token: token,
          refreshToken: refreshToken,
          exp: moment()
            .add(2, "days")
            .toDate()
        };
        return user.save();
      })
      .then(userWithNewToken => {
        const user_ = { ...userWithNewToken.toJSON() };
        delete user_.hash;
        delete user_.salt;
        delete user_.password;
        res.json(user_);
      })
      .catch(err => {
        res.status(401).json({ error: true, message: err.message || err });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const fileUpload = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no file was uploaded" });
    }

    const file = req.file;
    const params = req.body ? JSON.parse(req.body.body) : undefined;
    fs.writeFile(`${UPLOAD_FILES}/${file.originalname}`, file.buffer, err => {
      if (err) throw err;
      console.log("The file has been saved!");
      new Files(file)
        .save()
        .then(filenew => {
          res.json(filenew);
        })
        .catch(err => {
          res.status(403).json({ error: err.toString() });
        });
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const downloadFiles = (req, res) => {
  try {
    const params = req.body.filename;
    if (!params) {
      return res.status(400).json({ error: "no file was found" });
    }
    let fileDb;
    Files.findOne({ originalname: params }).exec()
    .then((file) => {
      if(!file) {
        throw new Error("no file was found");
      }
      fileDb = file;
      return fsPromises.readFile(`${UPLOAD_FILES}/${params}`)
    })
    .then(file => {
        res.set('mimeType', fileDb.mimetype);
        res.send(file);
        // res.end(file);
    })
    .catch(err => {
        res.status(403).json({ error: err.toString() });
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const obtainFiles = (req, res) => {
  try {
    Files.find({})
    .exec()
    .then((files) => {
      res.json(files);
    })
    .catch(err => {
      res.status(403).json({ error: err.toString() });
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  } 
}

module.exports = {
  login,
  createUser,
  logout,
  refreshToken,
  fileUpload,
  downloadFiles,
  obtainFiles
};
