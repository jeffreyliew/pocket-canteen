const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  favouriteCanteens: [
    {
      canteen: {
        type: Schema.Types.ObjectId,
        ref: "canteen",
      },
    },
  ],
  favouriteMeals: [
    {
      canteen: {
        type: Schema.Types.ObjectId,
        ref: "canteen",
      },
      id: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      notes: {
        type: [String],
        required: true,
      },
      prices: {
        students: {
          type: Number,
          required: true,
        },
        employees: {
          type: Number,
          required: true,
        },
        others: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

module.exports = mongoose.model("users", UserSchema);
