const Router = require('express').Router();
const AuthController = require('../controllers/auth');
const multer  = require('multer')
// const fileUpload = require('express-fileupload');
// Router.use(fileUpload());
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage });
Router.post("/login", AuthController.login);
Router.post("/create", AuthController.createUser);
Router.post("/logout", AuthController.logout);
Router.post("/refreshtoken", AuthController.refreshToken);
// Router.options("/upload", upload.single(), AuthController.fileUpload);
Router.post("/upload", upload.single("file"), AuthController.fileUpload);
Router.post("/download", AuthController.downloadFiles);
Router.post("/excel", upload.single("file"), AuthController.readexcel);
Router.get("/files", AuthController.obtainFiles);
// Router.get("/", BandController.getBand);

module.exports = Router;