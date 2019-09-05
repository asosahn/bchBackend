const passport = require("../utils/passport");
const moment = require("moment-timezone");
const User = require("../models/user");
const mongoose = require('mongoose');
const randtoken = require('rand-token')

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
      .then(user_ => {
        res.json(user_);
      })
      .catch(err => res.status(403).json({ err: err.toString() }));
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const logout =  (req, res, next) => {
  try {
    const params = req.body;
    const user = req.payload && req.payload.user ? req.payload.user : undefined;
    let promise = User.findOneAndUpdate({ refreshToken: params.refreshToken }, { $set: { auth: {} } }).exec();
    if (user) {
      promise = User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { auth: {} } }).exec();
    }
    promise
    .then((updated) => {
      res.json({ logout: true })
    })
    .catch((err) => {
      res.status(403).json({ logout: false, error: err.toString() })
    })
    
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const refreshToken =  (req, res, next) => {
  try {
    if (!req.body.refreshToken) {
      return res.status(403).json({ error: "refreshToken is required"  })
    }
    const refreshToken = req.body.refreshToken;
    User.findOne({"auth.refreshToken": refreshToken}).exec()
    .then(user => {
      if(!user) {
        throw Error("invalid refreshtoken");
      }
      const token = user.generateJwt(user);
      const refreshToken = randtoken.uid(256);
      user.auth = {
        token: token,
        refreshToken: refreshToken,
        exp: moment().add(2, 'days').toDate()
      }
      return user.save()
    })
    .then((userWithNewToken) => {
      const user_ = { ...userWithNewToken.toJSON() };
          delete user_.hash;
          delete user_.salt;
          delete user_.password;
      res.json(user_)
    })
    .catch((err) => {
      res.status(403).json({ error: err.toString() })
    })
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

module.exports = {
  login,
  createUser,
  logout,
  refreshToken
};
