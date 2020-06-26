const express = require("express");
const router = express.Router();

const isEmpty = require("../../validation/is-empty");

// model
const Canteen = require("../../models/Canteen");

// @route   GET api/canteen
// @desc    Get list of canteens by city
// @access  Public
router.get("/", (req, res) => {
  const { city } = req.query;

  const cityCaseInsensitive =
    city === "null" || city === "undefined" || isEmpty(city)
      ? {}
      : { city: new RegExp(`^${city}$`, "i") };

  Canteen.find(cityCaseInsensitive)
    .then((canteens) => {
      res.json(canteens);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/canteen/:id
// @desc    Get canteen by id
// @access  Public
router.get("/:id", (req, res) => {
  Canteen.findOne({ id: req.params.id })
    .then((canteen) => {
      res.json(canteen);
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
