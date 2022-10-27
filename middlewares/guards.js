function hasUser() {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/error");
    }
  };
}

function isGuest() {
  return (req, res, next) => {
    if (req.user) {
      res.redirect("/error"); //TODO: check assignment for correct redirect
    } else {
      next();
    }
  };
}


module.exports = {
  hasUser,
  isGuest,
};
