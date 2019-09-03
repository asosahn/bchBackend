const Router = require('express').Router();
const BandController = require("../controllers/band");

Router.post("/", BandController.createBand);
Router.get("/", BandController.getBand);

module.exports = Router;