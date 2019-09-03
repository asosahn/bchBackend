const Router = require('express').Router();
const AuthController = require('../controllers/auth');
Router.post("/login", AuthController.login);
Router.post("/create", AuthController.createUser);
// Router.get("/", BandController.getBand);

module.exports = Router;