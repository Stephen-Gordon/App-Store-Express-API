const mongoose = require('mongoose');

const appUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App',
        required: true
    }
});

module.exports = mongoose.model('AppUser', appUserSchema);
