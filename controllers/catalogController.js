const catalogController = require('express').Router();
const { hasUser, midUser } = require('../middlewares/guards');
const { parseError } = require('../util/parser');
const { getAll, getBook, createBook, wishBook, updateBook, deleteBook } = require('../services/bookService');

catalogController.get('/', async (req, res) => {
    const books = await getAll();
    res.render('catalog', {
        title: 'Catalog',
        books
    });
});

catalogController.get('/create', hasUser, (req, res) => {
    res.render('create', {
        title: 'Create Book'
    });
});

catalogController.post('/create', async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: Number(req.body.stars),
        imageUrl: req.body.imageUrl,
        review: req.body.review,
        owner: req.user._id
    };


    try {
        if (Object.values(book).filter(v => !v).length > 0) throw new Error('All fields are required')

        await createBook(book);
        res.redirect('/catalog');
    } catch (err) {
        const errors = parseError(err);
        res.render('create', {
            title: 'Create Book',
            body: {
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                stars: req.body.stars,
                imageUrl: req.body.imageUrl,
                review: req.body.review,
            },
            errors
        });
    }
});

//BOOK DETAILS

catalogController.get('/book/:id', midUser, async (req, res) => {
    const bookId = req.params.id;
    const book = await getBook(bookId);
    const user = req.user;


    res.render('bookDetails', {
        title: 'Details',
        book,
        user
    });
});

// WISH BOOK

catalogController.get('/wish/:id', [hasUser, midUser], async (req, res) => {
    const bookId = req.params.id;
    const user = req.user;

    if (user.wish) return res.redirect('/error');

    await wishBook(bookId, user._id);
    res.redirect(`/catalog/book/${bookId}`);
});

//EDIT BOOK

catalogController.get('/edit/:id', [hasUser, midUser], async (req, res) => {
    const bookId = req.params.id;
    const book = await getBook(bookId);
    const user = req.user;

    if (!user.isOwner) return res.redirect('/error');

    res.render('edit', {
        title: 'Edit Book',
        book
    });

});

catalogController.post('/edit/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        await updateBook(bookId, req.body);
        res.redirect(`/catalog/book/${bookId}`);
    } catch (err) {
        const errors = parseError(err);
        res.render('create', {
            title: 'Create Book',
            body: {
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                stars: req.body.stars,
                imageUrl: req.body.imageUrl,
                review: req.body.review,
            },
            errors
        });
    }

});

//DELETE BOOK

catalogController.get('/delete/:id', [hasUser, midUser], async (req, res) => {
    const bookId = req.params.id;
    const user = req.user;

    if (!user.isOwner) return res.redirect('/error');

    await deleteBook(bookId, req.body);
    res.redirect(`/catalog`);
}); 



module.exports = catalogController;