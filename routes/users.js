const express = require('express');
const router = express.Router();

const { profile, register, login } = require('../controllers/user.controller')

//import your routes from the controller
//export them to the server

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *       properties:
 *         full_name:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           description: User Email
 *         password:
 *           type: string
 *           description: User Password
 *         appsDownloaded:
 *           type: array
 *           items:
 *             type: string
 *             description: App id
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 *             description: Review ids
 * 
 *       example:
 *         full_name: Joe Bloggs
 *         email: bloggs@gmail.com
 *         password: YourSecretPassword
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error logging in
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User registration failed
 * /users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 * 
 */

router
    .get('/:id', profile)
    .post('/register', register)
    .post('/login', login)
    

module.exports = router;