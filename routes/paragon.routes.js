const Router = require('express').Router();
const paragon = require("../controllers/paragon")

Router.get("/", paragon.getParagonData);
Router.get("/days", paragon.getParagonDataDay);
Router.get("/download", paragon.downloadParagon);
Router.get("/downloadfiles", paragon.downloadParagonFiles);

module.exports = Router;