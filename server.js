const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const passport = require("passport");

const users = require("./routes/api/users");
const canteen = require("./routes/api/canteen");

const app = express();

// model
const Canteen = require("./models/Canteen");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// db config
const mongoURI = require("./config/keys").mongoURI;

// connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB Connected");

    try {
      // get initial canteen data
      const result = await axios.get("https://openmensa.org/api/v2/canteens");
      result.data.map(async (data) => {
        const canteenFields = {
          id: data.id,
          name: data.name,
          city: data.city,
          address: data.address,
          coordinates: {
            lat: data.coordinates[0],
            long: data.coordinates[1],
          },
        };

        const canteen = await Canteen.findOne({ id: data.id });

        // check if record exists
        if (canteen) {
          // update
          Canteen.updateOne({ id: canteen.id }, { $set: canteenFields });
        } else {
          // save new canteen
          const savedCanteen = await new Canteen(canteenFields).save();
          console.log(savedCanteen);
        }
      });
    } catch (err) {
      console.log(err);
    }
  })
  .catch((err) => console.log(err));

// passport middleware
app.use(passport.initialize());

// passport Config
require("./config/passport")(passport);

// routes
app.use("/api/users", users);
app.use("/api/canteen", canteen);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
