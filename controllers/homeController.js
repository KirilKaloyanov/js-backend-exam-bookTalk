const { hasUser } = require("../middlewares/guards");
const { getAllByUser} =require('../services/bookService');

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

homeController.get('/profile', hasUser, async (req,res) => {
  const user = req.user;
  const userBooks = await getAllByUser(user);
  res.render('profile', {
    title: 'Profile',
    user,
    userBooks 
  });
});

module.exports = homeController;
