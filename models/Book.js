const { Schema, model, Types } = require('mongoose');

const URL_PATTERN= /^https?:\/\/.+$/i;

const bookShema = new Schema({
    title: {
        type: String, required: true,
        minlength: [2, "Title must be at least 2 characters long"],
    },
    author: {
        type: String, required: true,
        minlength: [5, "Author must be at least 5 characters long"],
    },
    genre: {
        type: String, required: true,
        minlength: [3, "Genre must be at least 3 characters long"],
    },
    stars: { type: Number, required: true, min: [1, 'Stars must be between 1 and 5'], max: [5, 'Stars must be between 1 and 5'] },
    imageUrl: { type: String, required: true, validate: {
        validator: (value) => URL_PATTERN.test(value),
        message: 'Image URL is not valid'
    } },
    review: {
        type: String, required: true,
        minlength: [10, "Review must be at least 10 characters long"],
    },
    wishList: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: Types.ObjectId
});

const Book = model('Book', bookShema);

module.exports = Book;