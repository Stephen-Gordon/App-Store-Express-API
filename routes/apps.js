const express = require('express');
const router = express.Router();

const {loginRequired    } = require('../controllers/user.controller')

const { readData, readOne, createData, updateData, deleteData } = require('../controllers/app.controller')

//import your routes from the controller
//export them to the server

router
    .get('/', readData)
    .get('/:id', loginRequired, readOne)
    .post('/', createData)
    .put('/:id', updateData)
    .delete('/:id', deleteData)


module.exports = router;