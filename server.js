const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const passport = require("passport");
const path = require("path");

const isEmpty = require("./validation/is-empty");

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
      // condition to break "do while"
      let result;
      // parameter for API call
      let page = 1;

      do {
        // get initial canteen data
        result = await axios.get(
          `https://openmensa.org/api/v2/canteens?page=${page}`
        );

        // if result is empty skip this part and end the loop
        if (!isEmpty(result.data)) {
          result.data.map(async (data) => {
            if (isEmpty(data.coordinates)) return;

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
        }

        page++;
      } while (!isEmpty(result.data));
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

// // redirect http to https
// app.use((req, res, next) => {
//   if (req.secure) {
//     next();
//   } else {
//     res.redirect("https://" + req.headers.host + req.url);
//   }
// });

// serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
