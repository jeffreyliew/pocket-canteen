const express = require("express");
const router = express.Router();

// model
const Canteen = require("../../models/Canteen");

// @route   GET api/canteen
// @desc    Get list of canteens by city
// @access  Public
router.get("/", (req, res) => {
  const cityCaseInsensitive = new RegExp(`^${req.query.city}$`, "i");

  Canteen.find({ city: cityCaseInsensitive })
    .then((canteens) => {
      res.json(canteens);
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
