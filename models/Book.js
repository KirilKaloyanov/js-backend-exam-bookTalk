const { Schema, model, Types } = require('mongoose');

const bookShema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    genre: {type: String, required: true},
    stars: {type: Number, required: true, min: 1, max:5},
    imageUrl: {type: String, required: true},
    review: {type: String, required: true},
    wishList: {type: [Types.ObjectId], ref: 'User', default: []},
    owner: Types.ObjectId
}); 

const Book = model('Book', bookShema);

module.exports = Book;