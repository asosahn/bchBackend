const Router = require('express').Router();
const SongsByArtist = require("../controllers/songsbyartists");

Router.post("/", SongsByArtist.createSongsByArtist);
Router.get("/", SongsByArtist.getSongsByArtist);

module.exports = Router;