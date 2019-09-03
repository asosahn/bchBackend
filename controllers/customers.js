const Customer = require("../models/customers");

const createCustomer = (req, res) => {
    try {
        const props = req.body;
        const newCustomer = new Customer(props);
        newCustomer.save()
        .then((customer) => {
            res.json(customer);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getCustomers = (req, res) => {
    try {
        const props = req.query;
        Customer.find(props)
        .exec()
        .then((customers) => {
            res.json(customers);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}


module.exports = {
    createCustomer,
    getCustomers
}