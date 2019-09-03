const Band = require("../models/band");
const mongoose = require('mongoose');

const createBand = (req, res) => {
    try {
        const props = req.body;
        const newBand = new Band(props);
        newBand.save()
        .then((band) => {
            res.json(band);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getBand = (req, res) => {
    try {
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.artist) {
            props.artist = mongoose.Types.ObjectId(props.artist);
        }
        Band.find(props)
        // .populate('artist')
        .exec()
        .then((band) => {
            res.json(band);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}


module.exports = {
    createBand,
    getBand
}