const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size_bytes: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    rating_count_tot: {
        type: Number,
        required: true
    },
    user_rating: {
        type: Number,
        required: true
    },
    ver: {
        type: String,
        required: true
    },
    cont_rating: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

module.exports = mongoose.model('App', appSchema);
