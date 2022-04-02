"use strict";

let express = require("express");
let path = require("path");
let mongoose = require("mongoose");
let params = require("./params/params");
let bodyParser = require("body-parser");
let routes = require("./routes");

let app = express();

mongoose.connect(params.DATABASECONNECTION);

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

app.listen(app.get("port"), () => {
  console.log("Server started on port number: " + app.get("port"));
});
