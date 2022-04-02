"use strict";

let mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users" }
);

let user = mongoose.model("user", userSchema);

module.exports = user;
