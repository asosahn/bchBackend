const Router = require('express').Router();
const ArtistController = require("../controllers/artists");

Router.post("/", ArtistController.createArtist);
Router.get("/", ArtistController.getArtist);

module.exports = Router;