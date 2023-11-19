const express = require("express");
const router = express.Router();

const imageUpload = require("../configs/imageUpload");

// Middleware
const { checkRole } = require("../middleware/checkRole");
const { loginRequired } = require("../middleware/loginRequired");

const {
	readData,
	readOne,
	createData,
	updateData,
	deleteData,
} = require("../controllers/app.controller");

router.get("/", readData).get("/:id", readOne);

router
	.use(checkRole, loginRequired)
	.post("/", imageUpload.single("image"), createData)
	.put("/:id", imageUpload.single("image"), updateData)
	.delete("/:id", deleteData);

module.exports = router;

// docs
/**
 * @swagger
 * components:
 *   schemas:
 *     App:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The title of your App
 *         size_bytes:
 *           type: string
 *           description: Size of your App in bytes
 *         price:
 *           type: string
 *           description: Price of the App
 *         ver:
 *           type: string
 *           description: Release Version
 *         cont_rating:
 *           type: string
 *           description: Content Rating of the App
 *         category:
 *           type: string
 *           description: Category of the App
 *
 *
 *       example:
 *         name: Pay anyone anywhere
 *         size_bytes: 200000
 *         price: false
 *         ver: 1.0
 *         cont_rating: 4
 *         category: Gaming
 *
 */

/**
 * @swagger
 * tags:
 *   name: Apps
 *   description: All App endpoints
 * security:
 *    - BearerAuth: []
 * /apps:
 *   get:
 *     summary: Lists all the apps
 *     tags: [Apps]
 *     responses:
 *       200:
 *         description: Get all Apps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/App'
 *   post:
 *     summary: Create a new App
 *     tags: [Apps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/App'
 *     responses:
 *       200:
 *         description: The created app.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/App'
 *       500:
 *         description: Some server error
 *
 * /apps/{id}:
 *   get:
 *     summary: Get the app by id
 *     tags: [Apps]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The app id
 *     responses:
 *       200:
 *         description: The app response by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/App'
 *       404:
 *         description: The app was not found
 *   put:
 *    summary: Update the app by the id
 *    tags: [Apps]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The app id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/App'
 *    responses:
 *      200:
 *        description: The app was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/App'
 *      404:
 *        description: The app was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the app by id
 *     tags: [Apps]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The app id
 *
 *     responses:
 *       200:
 *         description: The app was deleted
 *       404:
 *         description: The app was not found
 */
