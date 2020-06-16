const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");

const app = express();

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
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
