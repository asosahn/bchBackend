const Router = require('express').Router();
const paragon = require("../controllers/paragon")

Router.get("/", paragon.getParagonData);
Router.get("/days", paragon.getParagonDataDay);
Router.get("/download", paragon.downloadParagon);

module.exports = Router;