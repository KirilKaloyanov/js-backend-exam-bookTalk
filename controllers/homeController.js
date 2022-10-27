const homeController = require("express").Router();

//TODO replace with real controller by assignment

homeController.get("/", (req, res) => {
  res.render("home", {
    title: "Home page",
    // user: req.user,
  });
});

homeController.get("/error", (req, res) => {
  res.render("error", {
    title: "Not Found",
  });
});

module.exports = homeController;
