const express = require('express');
const router = express.Router();


//import your routes from the controller
const { readData, createData } = require('../controllers/review.controller')

//export them to the server

router
    .get('/', readData)
    .post('/', createData)
    
module.exports = router;