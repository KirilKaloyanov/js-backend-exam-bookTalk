const catalogController = require('express').Router();
const { hasUser } = require('../middlewares/guards');
const { parseError } = require('../util/parser');
const { getAll, getBook, createBook, wishBook, updateBook, deleteBook } = require('../services/bookService');

catalogController.get('/', async (req, res) => {
    const books = await getAll();
    res.render('catalog', {
        title: 'Catalog',
        books
    });
});

catalogController.get('/create', hasUser(), (req, res) => {
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

catalogController.get('/book/:id', async (req, res) => {
    const bookId = req.params.id;
    const book = await getBook(bookId);

    const user = await midUser(bookId, req.user);

    res.render('bookDetails', {
        title: 'Details',
        book,
        user
    });
});

// WISH BOOK

catalogController.get('/wish/:id', hasUser(), async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user._id;

    const user = await midUser(bookId, req.user);
    if (user.wish) return res.redirect('/error');

    await wishBook(bookId, userId);
    res.redirect(`/catalog/book/${bookId}`);
});

//EDIT BOOK

catalogController.get('/edit/:id', hasUser(), async (req, res) => {
    const bookId = req.params.id;
    const book = await getBook(bookId);

    const user = await midUser(bookId, req.user);
    if (!user.isOwner) return res.redirect('/error');

    res.render('edit', {
        title: 'Edit Book',
        book
    });

});

catalogController.post('/edit/:id', async (req, res) => {
    const bookId = req.params.id;
    await updateBook(bookId, req.body);
    res.redirect(`/catalog/book/${bookId}`);
});

//DELETE BOOK

catalogController.get('/delete/:id', hasUser(), async (req, res) => {
    const bookId = req.params.id;

    const user = await midUser(bookId, req.user);
    if (!user.isOwner) return res.redirect('/error');

    await deleteBook(bookId, req.body);
    res.redirect(`/catalog`);
});

async function midUser(bookId, user) {
    const book = await getBook(bookId);

    if (book.owner.toString() === user._id) {
        user.isOwner = true;
    } else {
        user.isVisitor = true;
        if (book.wishList.map(w => w.toString()).indexOf(user._id) >= 0)
            user.wished = true;
    }
    return user;
}

module.exports = catalogController;