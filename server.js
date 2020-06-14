const express = require("express");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
