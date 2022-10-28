const { getBook } = require('../services/bookService')

function hasUser(req, res, next) {

    if (req.user) {
      next();
    } else {
      res.redirect("/error");
    }
  
}

function isGuest(req, res, next) {

    if (req.user) {
      res.redirect("/error"); //TODO: check assignment for correct redirect
    } else {
      next();
    }
  
}


async function midUser(req, res, next) {

  if(req.user){
    const book = await getBook(req.params.id);
    // console.log(req.user);
    
    if (book.owner.toString() === req.user._id) {
      req.user.isOwner = true;
    } else {
      req.user.isVisitor = true;
      if (book.wishList.map(w => w.toString()).indexOf(req.user._id) >= 0)
      req.user.wished = true;
    }
    next();
  } else {
    next();
  }
}

module.exports = {
  hasUser,
  isGuest,
  midUser
};
