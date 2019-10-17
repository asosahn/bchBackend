var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const customerRouter = require("./routes/customers.routes");
const billRouter = require("./routes/bills.routes");
const bandsRouter = require("./routes/band.routes");
const songsRouter = require("./routes/songs.routes");
const artistRouter = require("./routes/artist.routes");
const AuthRouter = require("./routes/auth.routes");
const songByArtistRouter = require("./routes/songsbyartist.routes");
const ParagonRouter = require("./routes/paragon.routes");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const cors = require("cors");
const Tokens = require("./models/tokens");
const moment = require("moment-timezone");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    "mongodb://hazsk:hazsk20182018@kcheo.com:27017/bchpruebas?authSource=admin",
    { useNewUrlParser: true }
  )
  // mongoose.connect('mongodb://localhost:27017/bchpruebas', {useNewUrlParser: true})
  .then(() => console.log("Connected to mongodb"))
  .catch(err => {
    console.log(err);
  });

const isRevoked = (req, payload, done) => {
  const token = req.headers.authorization.split(" ")[1] || req.query.token;
  Tokens.findOne({ token: token })
    .exec()
    .then(token => {
      if (!token) {
        return done();
      } else {
        return done(new Error("token blocked"));
      }
    });
};

const publicKey = "BCH ANGULARJS";
const jwtConfig = {
  secret: publicKey,
  // isRevoked: redisClient.middleware.bind(redisClient),
  isRevoked: isRevoked,
  userProperty: "payload",
  getToken: req => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return undefined;
  }
};

// catch 404 and forward to error handler

app.use("/", indexRouter);
app.use(
  jwt(jwtConfig).unless({
    path: [
      { url: "/auth/login" },
      { url: "/auth/logout" },
      { url: "/auth/create" },
      { url: "/auth/refreshtoken" },
      { url: "/paragon" },
      { url: "/paragon/download" },
      { url: "/paragon/days" },
      { url: "/paragon/downloadfiles" },
    ]
  })
);
app.use("/users", usersRouter);
app.use("/auth", AuthRouter);

app.use("/customer", customerRouter);
app.use("/bill", billRouter);
app.use("/songs", songsRouter);
app.use("/artist", artistRouter);
app.use("/bands", bandsRouter);
app.use("/songbyartist", songByArtistRouter);
app.use("/paragon", ParagonRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  if (err.message === "token blocked") {
    err.status = 401;
  }
  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

module.exports = app;
