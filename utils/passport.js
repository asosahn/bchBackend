const passport = require("passport");
const passportLocal = require("passport-local");
const User = require('../models/user');
const LocalStrategy = passportLocal.Strategy;

passport.use(
  "local",
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username, enabled: true })
      .select("+password +hash +salt")
      .exec()
      .then(user => {
        if (!user) {
          return done(undefined, false, { message: "error.notExists" });
        }
        user.isValidPassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(undefined, user);
          }
          return done(undefined, false, { message: "error.userAndPassword" });
        });
      })
      .catch(err => {
        done(err);
      });
  })
);

module.exports = passport;
