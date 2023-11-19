const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    full_name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min:6
    },
    role: {
        type: String,
        default: 'user',
        required: true
    },
    appsDownloaded: [{ 
        type: Schema.Types.ObjectId,
        ref: 'App' 
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    
}, {timestamps: true});

//model method
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = model('User', userSchema)
