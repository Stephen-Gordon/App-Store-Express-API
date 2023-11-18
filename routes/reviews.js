const express = require('express');
const router = express.Router();

//Auth
const { loginRequired } = require('../controllers/user.controller')


//import your routes from the controller
const { readData, createData, deleteData } = require('../controllers/review.controller')

//export them to the server


/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - content
 *         - rating
 *       properties:
 *         content:
 *           type: string
 *           description: Your review text
 *         rating:
 *           type: number
 *           description: Rating between 1-5
 * 
 * 
 *       example:
 *         content: I really like this App. It's been very useful
 *         rating: 4
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: All Review endpoints
 * security:
 *    - BearerAuth: []
 * /reviews:
 *   get:
 *     summary: Lists all the reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Get all Reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Create a new Review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: The created review.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Some server error
 * 
 *   delete:
 *     summary: Remove the review by id
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The review id
 *
 *     responses:
 *       200:
 *         description: The review was deleted
 *       404:
 *         description: The review was not found
 */



router
    .get('/', readData)
    .post('/', createData)
    .delete('/:id', deleteData)
    
module.exports = router;