const express = require('express');
const router = express.Router();

const imageUpload = require('../configs/imageUpload');

//Auth
const { loginRequired } = require('../controllers/user.controller')

const { readData, readOne, createData, updateData, deleteData } = require('../controllers/app.controller')

//import your routes from the controller
//export them to the server

router
    .get('/', readData)
    .get('/:id', loginRequired, readOne)
    .post('/', imageUpload.single('image'), createData)
    .put('/:id', imageUpload.single('image'), updateData)
    .delete('/:id', deleteData)


module.exports = router;