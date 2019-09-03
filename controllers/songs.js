const Songs = require("../models/songs");
const mongoose = require('mongoose');

const createSong = (req, res) => {
    try {
        const props = req.body;
        const newSongs = new Songs(props);
        newSongs.save()
        .then((song) => {
            res.json(song);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getSongs = (req, res) => {
    try {
        const props = req.query;
        if (props._id) {
            props._id = mongoose.Types.ObjectId(props._id);
        }
        if (props.name) {
            props.name = RegExp(props.name, "i");
        }
        Songs.find(props)
        .exec()
        .then((song) => {
            res.json(song);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}


module.exports = {
    createSong,
    getSongs
}