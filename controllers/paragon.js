const mongoose = require("mongoose");
const Paragon = require("../models/paragonfiles");
const ParagonDay = require("../models/paragondays");
const path = require("path");
const UPLOAD_FILES = path.join(__dirname, "/../files");

const getParagonData = (req, res) => {
  try {
    const params = req.query;
    console.log(params);
    Paragon.find(params)
      .exec()
      .then(files => {
        res.json(files);
      })
      .catch(err => {
        res.status(403).json({ err: err.toString() });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const getParagonDataDay = (req, res) => {
  try {
    const params = req.query;
    ParagonDay.find(params)
      .exec()
      .then(files => {
        res.json(files);
      })
      .catch(err => {
        res.status(403).json({ err: err.toString() });
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.toString() });
  }
};

const downloadParagon = (req, res, next) => {
  try {
    const id = req.query.id;
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.download(`${UPLOAD_FILES}/${id}.pdf`, `${id}.pdf`, (err) => {
      if(err) {
        return res.redirect('http://iahrworldcongress.org/congress-complete-proceedings-book/');
      }
    } );
  } catch(err) {
     res.redirect('http://iahrworldcongress.org/congress-complete-proceedings-book/');
  }
}

const downloadParagonFiles = (req, res, next) => {
  try {
    const id = req.query.id;
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.download(`${UPLOAD_FILES}/${id}`, `${id}`, (err) => {
      if(err) {
        return res.redirect('http://iahrworldcongress.org/congress-complete-proceedings-book/');
      }
    } );
  } catch(err) {
     res.redirect('http://iahrworldcongress.org/congress-complete-proceedings-book/');
  }
}
const saveParagon = async (params) => {
  const saved = await Paragon.updateMany(
    { description: params.description, author: params.author },
    { $set: params },
    { upsert: true }
  ).exec();
  return saved;
};

module.exports = {
    getParagonData,
  saveParagon,
  downloadParagon,
  getParagonDataDay,
  downloadParagonFiles
};
