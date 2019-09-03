const Router = require('express').Router();
const BillController = require("../controllers/bills");

Router.post("/", BillController.createBill);
Router.get("/", BillController.getBills);

module.exports = Router;