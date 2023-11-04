const express = require('express');
const router = express.Router();

//Auth
const {     loginRequired    } = require('../controllers/user.controller')


//import your routes from the controller
const { readData, createData } = require('../controllers/review.controller')

//export them to the server

router
    .get('/', loginRequired, readData)
    .post('/', loginRequired, createData)
    
module.exports = router;