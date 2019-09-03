const SongsByArtist = require("../models/songsByArtist");
const mongoose = require('mongoose');

const createSongsByArtist = (req, res) => {
    try {
        const props = req.body;
        const newSongsByArtist = new SongsByArtist(props);
        newSongsByArtist.save()
        .then((songbyartist) => {
            res.json(songbyartist);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getSongsByArtist = (req, res) => {
    try {
        const props = req.query;
        if (props.artist) {
            props.artist = mongoose.Types.ObjectId(props.artist);
        }
        if (props.song) {
            props.song = mongoose.Types.ObjectId(props.song);
        }
        SongsByArtist.find(props)
        // .populate('artist')
        // .populate('song')
        .exec()
        .then((songbyartist) => {
            res.json(songbyartist);
        })
        .catch((err) => {
            res.status(403).json(err.message);
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}


module.exports = {
    createSongsByArtist,
    getSongsByArtist
}