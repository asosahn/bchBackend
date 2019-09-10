const Artist = require("../models/artists");
const mongoose = require('mongoose');

const createArtist = (req, res) => {
    try {
        const props = req.body;
        const newArtist = new Artist(props);
        newArtist.save()
        .then((artist) => {
            res.json(artist);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getArtist = (req, res) => {
    try {
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.name) {
            props.name = RegExp(props.name, "i");
        }
        Artist.find(props)
        .exec()
        .then((artist) => {
            res.json(artist);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}

const updateArtist = (req, res) => {
    try {
        const props = req.body;
        Artist.findOneAndUpdate({_id: mongoose.Types.ObjectId(props._id) }, { $set: props }, { new: true })
        .exec()
        .then((artist) => {
            res.json(artist);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}


module.exports = {
    createArtist,
    getArtist,
    updateArtist
}