const Book = require('../models/Book');

async function getAll() {
    return await Book.find({}).lean();
}

async function getAllByUser(userId) {
    const books = await Book.find({}).lean();
    return books.filter(b => b.wishList.map(b => b.toString()).includes(userId._id));
}

async function getBook(bookId) {
    return await Book.findById(bookId).lean();
}

async function createBook(book) {
    await Book.create(book);
}

async function wishBook(bookId, userId) {
    const book = await Book.findById(bookId);
    book.wishList.push(userId);

    await book.save(); 
}

async function updateBook(bookId, updatedBook) {
    const book = await Book.findById(bookId);

    Object.assign(book, updatedBook);

    await book.save();
}

async function deleteBook(bookId) {
    await Book.findByIdAndRemove(bookId);
}

module.exports = {
    createBook,
    getAll,
    getAllByUser,
    getBook,
    wishBook,
    updateBook,
    deleteBook
};