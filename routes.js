"use strict";

let express = require("express");
let router = express.Router();
let user = require("./models/user");
let task = require("./models/task");
let requestIp = require("request-ip");
let activeUsers = [];

let checkActiveUser = function (clientIp) {
  for (let i = 0; i < activeUsers.length; i++) {
    if (activeUsers[i][0] == clientIp) {
      return {
        bool: true,
        email: activeUsers[i][1],
      };
    }
  }
  return {
    bool: false,
    email: "",
  };
};
// let passport = require("passport");

router.get("/", function (req, res) {
  let clientIp = requestIp.getClientIp(req);

  if (checkActiveUser(clientIp).bool) {
    res.redirect("/dashboard");
  } else {
    res.render("index");
  }
});

router.get("/home", function (req, res) {
  let clientIp = requestIp.getClientIp(req);

  if (checkActiveUser(clientIp).bool) {
    res.redirect("/dashboard");
  } else {
    res.render("home");
  }
});

router.get("/dashboard", (req, res) => {
  let clientIp = requestIp.getClientIp(req);
  let result = checkActiveUser(clientIp);

  if (result.bool) {
    task.find({ email: result.email }, (error, tasks) => {
      if (error) {
        console.log(error);
        return res.status(500).send();
      }
      res.render("dashboard", { page_title: "Users - Node.js", data: tasks });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/task", (req, res) => {
  let clientIp = requestIp.getClientIp(req);

  if (checkActiveUser(clientIp).bool) {
    res.render("task");
  } else {
    res.redirect("/");
  }
});

router.post("/task", (req, res) => {
  let clientIp = requestIp.getClientIp(req);
  let result = checkActiveUser(clientIp);

  if (result.bool) {
    try {
      let newTask = new task({
        email: result.email,
        task: req.body.task,
        time: req.body.time,
        date: req.body.date,
      });

      newTask.save();
      console.log(newTask);
    } catch (error) {
      console.log(error);
    }
  }
  res.redirect("/task");
});

router.get("/login", function (req, res) {
  let clientIp = requestIp.getClientIp(req);

  if (checkActiveUser(clientIp).bool) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

router.post("/login", (req, res) => {
  user.findOne(
    { email: req.body.email, password: req.body.password },
    (error, user) => {
      if (error) {
        console.log(error);
        return res.status(500).send();
      }

      if (user == null) {
        console.log("User does not exist!");
        res.redirect("/login");
      } else {
        let clientIp = requestIp.getClientIp(req);

        activeUsers.push([clientIp, req.body.email]);
        console.log("The client Ip is :" + clientIp);
        console.log(activeUsers);
        res.redirect("/dashboard");
      }
    }
  );
});

router.get("/signup", function (req, res) {
  let clientIp = requestIp.getClientIp(req);

  if (checkActiveUser(clientIp).bool) {
    res.redirect("/dashboard");
  } else {
    res.render("signup");
  }
});

router.post("/signup", async function (req, res) {
  let password = req.body.password;
  let repassword = req.body.repassword;

  if (password != repassword) {
    res.redirect("/signup");
  } else {
    user.findOne({ username: req.body.username }, (error, existingUser) => {
      if (error) {
        console.log(error);
        return res.status(500).send();
      }

      if (existingUser == null) {
        user.findOne({ email: req.body.email }, (error, emailExists) => {
          if (error) {
            console.log(error);
            return res.status(500).send();
          }

          if (emailExists == null) {
            try {
              let newUser = new user(req.body);

              newUser.save();
              console.log(newUser);
            } catch (error) {
              console.log(error);
            }

            res.redirect("/login");
          } else {
            console.log("email exists!");
            res.redirect("/signup");
          }
        });
      } else {
        console.log("user already exists!");
        res.redirect("/signup");
      }
    });
  }
});

router.get("/logout", (req, res) => {
  let clientIp = requestIp.getClientIp(req);

  let pos = 0;

  for (let i = 0; i < activeUsers.length; i++) {
    if (clientIp == activeUsers[i][0]) {
      pos = i;
      break;
    }
  }
  activeUsers = activeUsers.splice(pos, pos);
  console.log(activeUsers);
  res.redirect("/");
});

module.exports = router;
