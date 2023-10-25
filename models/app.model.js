const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    developer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: {
        type: [{
            user: String,
            rating: Number,
            comment: String
        }],
        required: true
    }
});

module.exports = mongoose.model('App', appSchema);
