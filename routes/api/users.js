const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const webpush = require("web-push");
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

// @route   GET api/users/favourite/canteen
// @desc    Get favourite canteens
// @access  Private
router.get(
  "/favourite/canteen",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate("favouriteCanteens.canteen")
      .then((user) => res.json(user.favouriteCanteens));
  }
);

// @route   POST api/users/favourite/canteen/:_id
// @desc    Add favourite canteen
// @access  Private
router.post(
  "/favourite/canteen/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then((user) => {
      if (
        user.favouriteCanteens.filter(
          (canteen) => canteen.canteen.toString() === req.params._id
        ).length > 0
      ) {
        return res.status(400).json({ msg: "Canteen already added" });
      }

      // add canteen
      user.favouriteCanteens.unshift({ canteen: req.params._id });

      // save
      user.save().then((user) => {
        user.populate("favouriteCanteens.canteen", (err, user) => {
          res.json(user.favouriteCanteens);
        });
      });
    });
  }
);

// @route   DELETE api/users/favourite/canteen/:_id
// @desc    Delete favourite canteen
// @access  Private
router.delete(
  "/favourite/canteen/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then((user) => {
      if (
        user.favouriteCanteens.filter(
          (canteen) => canteen.canteen.toString() === req.params._id
        ).length === 0
      ) {
        return res.status(404).json({ msg: "Canteen not found " });
      }

      // remove index
      const removeIndex = user.favouriteCanteens
        .map((canteen) => canteen.canteen.toString())
        .indexOf(req.params._id);

      // remove
      user.favouriteCanteens.splice(removeIndex, 1);

      // save
      user.save().then((user) => {
        user.populate("favouriteCanteens.canteen", (err, user) => {
          res.json(user.favouriteCanteens);
        });
      });
    });
  }
);

// @route   GET api/users/favourite/meal
// @desc    Get favourite meals
// @access  Private
router.get(
  "/favourite/meal",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate("favouriteMeals.canteen")
      .then((user) => res.json(user.favouriteMeals));
  }
);

// @route   POST api/users/favourite/meal/:id
// @desc    Add favourite meal
// @access  Private
router.post(
  "/favourite/meal/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id).then((user) => {
      if (
        user.favouriteMeals.filter(
          (meal) => meal.id.toString() === req.params.id
        ).length > 0
      ) {
        return res.status(400).json({ msg: "Meal already added" });
      }
      const newMeal = {
        canteen: req.body.canteenId,
        date: req.body.date,
        id: req.params.id,
        category: req.body.category,
        name: req.body.name,
        notes: req.body.notes,
        prices: req.body.prices,
      };

      // add meal
      user.favouriteMeals.unshift(newMeal);

      // save
      user.save().then((user) => {
        user.populate("favouriteMeals.canteen", (err, user) => {
          res.json(user.favouriteMeals);
        });
      });
    });
  }
);

// @route   DELETE api/users/favourite/meal/:id
// @desc    Delete favourite meal
// @access  Private
router.delete(
  "/favourite/meal/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id).then((user) => {
      if (
        user.favouriteMeals.filter(
          (meal) => meal.id.toString() === req.params.id
        ).length === 0
      ) {
        return res.status(404).json({ msg: "Meal not found" });
      }

      // remove index
      const removeIndex = user.favouriteMeals
        .map((meal) => meal.id.toString())
        .indexOf(req.params.id);

      // remove
      user.favouriteMeals.splice(removeIndex, 1);

      // save
      user.save().then((user) => {
        user.populate("favouriteMeals.canteen", (err, user) => {
          res.json(user.favouriteMeals);
        });
      });
    });
  }
);

// Push Notification

// holds references to setInterval's Timeout object
let intervals = {};
let index = 1;

// @route   GET api/users/settings/push/meals
// @desc    Get push settings meals
// @access  Private
router.get(
  "/settings/push/meals",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .then((user) => {
        if (user.settings.pushNotifications.meal.pushIntervalId) {
          res.json({ mealNotification: true });
        } else {
          res.json({ mealNotification: false });
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route   POST api/users/push/subscribe
// @desc    Subscribe
// @access  Private
router.post(
  "/push/subscribe",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id)
      .populate("favouriteMeals.canteen")
      .then((user) => {
        // return if already subscribed
        if (user.settings.pushNotifications.meal.pushIntervalId) {
          return res.status(400).json({ msg: "Already subscribed" });
        }

        // get pushSubscription, user timezoneOffset
        const { subscription, timezoneOffset } = req.body;

        // define callback with closure
        const cb = (timezoneOffset) => () => {
          // get newest favouriteMeals of user
          User.findById(req.user.id)
            .populate("favouriteMeals.canteen")
            .then((user) => {
              // set favourite meals
              let favouriteMeals = user.favouriteMeals;

              // check if favouriteMeals is not empty
              if (favouriteMeals.length > 0) {
                // get today's date
                const today = new Date(
                  Date.now() - timezoneOffset
                ).toISOString();

                // check if meal date matches today's date
                const mealsToday = favouriteMeals.filter(
                  (meal) => today.indexOf(meal.date) !== -1
                );

                // check if a favourite meal is sold today
                if (mealsToday.length > 0) {
                  mealsToday.forEach((meal) => {
                    // create payload
                    const payload = JSON.stringify({
                      title: meal.name,
                      body: meal.canteen.name,
                      icon: "/logo192.png",
                    });

                    // send push notification
                    webpush
                      .sendNotification(subscription, payload)
                      .catch((err) =>
                        clearInterval(
                          intervals[
                            user.settings.pushNotifications.meal.pushIntervalId
                          ]
                        )
                      );
                  });
                }
              }
            });
        };

        // setInterval
        intervals[index] = setInterval(cb(timezoneOffset), 24 * 60 * 60 * 1000);

        // save subscription, interval id
        user.settings.pushNotifications.meal.pushSubscription = subscription;
        user.settings.pushNotifications.meal.pushIntervalId = index;
        user.save().then((user) => res.json({ mealNotification: true }));

        // run once when subscribing
        cb(timezoneOffset)();

        index++;
      });
  }
);

// @route   DELETE api/users/push/unsubscribe
// @desc    Unsubscribe
// @access  Private
router.delete(
  "/push/unsubscribe",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id).then((user) => {
      user.settings.pushNotifications.meal.pushSubscription = null;
      const intervalId = user.settings.pushNotifications.meal.pushIntervalId;
      user.settings.pushNotifications.meal.pushIntervalId = null;
      user.save().then((user) => res.json({ mealNotification: false }));

      clearInterval(intervals[intervalId]);
      delete intervals[intervalId];
    });
  }
);

module.exports = router;
