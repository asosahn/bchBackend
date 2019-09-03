const Router = require('express').Router();
const SongsController = require("../controllers/songs");

Router.post("/", SongsController.createSong);
Router.get("/", SongsController.getSongs);

module.exports = Router;