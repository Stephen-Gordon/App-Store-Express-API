const express = require('express');
const router = express.Router();

const { profile, register, login } = require('../controllers/user.controller')

//import your routes from the controller
//export them to the server

router
    .post('/', profile)
    .post('/register', register)
    .post('/login', login)
    

module.exports = router;