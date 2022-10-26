const catalogController = require('express').Router();

catalogController.get('/', (req, res) => {
    res.render('catalog');
});

module.exports = catalogController;