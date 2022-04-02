"use strict";

let mongoose = require("mongoose");

let taskSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    task: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
  },
  { collection: "Tasks" }
);

let task = mongoose.model("task", taskSchema);

module.exports = task;
