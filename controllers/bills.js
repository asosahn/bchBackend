const Bill = require("../models/bills");
const mongoose = require('mongoose');

const createBill = (req, res) => {
    try {
        const props = req.body;
        const newBill = new Bill(props);
        newBill.save()
        .then((bill) => {
            res.json(bill);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getBills = (req, res) => {
    try {
        console.log(req.query)
        const props = req.query;
        if (props.customer) {
            props.customer = mongoose.Types.ObjectId(props.customer);
        }
        Bill.find(props)
        .exec()
        .then((bill) => {
            
            res.status(200).json(bill);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}


module.exports = {
    createBill,
    getBills
}