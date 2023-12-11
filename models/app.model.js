const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size_bytes: {
        type: String
    },
    price: {
        type: String,
    },
    averageRating: {
        type: Number
    },
    ver: {
        type: String
    },
    cont_rating: {
        type: String,
    },
    description: {
        type: String
    },
    genre: {
        type: String
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    image_path: {
        type: String
    },
});

module.exports = mongoose.model('App', appSchema);
