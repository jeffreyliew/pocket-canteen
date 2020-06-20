const express = require("express");
const router = express.Router();

// model
const Canteen = require("../../models/Canteen");

// @route   GET api/canteen
// @desc    Get list of canteens
// @access  Public
router.get("/", (req, res) => {
  Canteen.find()
    .then((canteens) => {
      res.json(canteens);
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
