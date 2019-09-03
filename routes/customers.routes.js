const Router = require('express').Router();
const CustomerController = require("../controllers/customers");

Router.post("/", CustomerController.createCustomer);
Router.get("/", CustomerController.getCustomers);

module.exports = Router;