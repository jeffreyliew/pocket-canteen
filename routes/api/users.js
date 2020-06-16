const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/keys").secretOrKey;

// validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// model
const User = require("../../models/User");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // check password
    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        // password correct

        // create jwt payload
        const payload = { id: user.id, username: user.username };

        // sign token
        jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({ success: true, token: "Bearer " + token });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
