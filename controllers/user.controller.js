const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = (req, res) => {
    
    let newUser = new User(req.body)
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    
    //Validate
 
    // Promise
    newUser.save()
    .then(user => {
        //if successful send data back without the password
        user.password = undefined
        return res.status(201).json({
            data: user
        })
    })
    .catch(err => {
        return res.status(400).json({
            msg: err
        })
    })
    
}

const login = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        //password match
        console.log('Found ', user)
        let token = null;

        //if user password is wrong
        !user || !user.comparePassword(req.body.password) ? res.status(401).json({
            msg: 'Authentication failed, username or password is wrong'
        })
        ://successful

        token = jwt.sign({
            email: user.email,
            full_name: user.full_name,
            _id: user._id 
        } , process.env.JWT_SECRET)

        res.status(200).json({
            msg: 'Login successful',
            token: token
        })
    })
    .catch(err => {
        return res.status(400).json({
            msg: err
        })
    })
}

const loginRequired = (req, res, next) => {
    if(req.user) {
        next()
    }
    else {
        return res.status(401).json({
            msg: 'Unauthorized user'
        })
    }
}

const profile = (req, res) => {
    
}

module.exports ={
    register,
    login,
    profile,
    loginRequired
};