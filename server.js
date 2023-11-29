const express = require("express");
const app = express();

const host = "0.0.0.0";
const port = process.env.PORT || 3000;

const jwt = require("jsonwebtoken");
(bodyParser = require("body-parser")),
	(swaggerJsdoc = require("swagger-jsdoc")),
	(swaggerUi = require("swagger-ui-express"));

require("dotenv").config();
require("./configs/db.js")();
const cors = require("cors");

app.use(express.json());
app.set("view engine", "html");
app.use(cors()); 
app.use(express.static(__dirname + "/views/"));
app.use(express.static(__dirname + "/public/"));

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "App Store Express / Mongo API",
			version: "0.1.0",
			description: "An App Store Api built with Express, Mongo, and Swagger",
			license: {
				name: "MIT",
				url: "https://spdx.org/licenses/MIT.html",
			},
			contact: {
				name: "Stephen Gordon",
				url: "https://stephengordon.ie",
				email: "stephengordon48@gmail.com",
			},
		},
		servers: [
			{
				url: "https://express-app-store-api-6f6c8ec32640.herokuapp.com/api/",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					in: "header",
					name: "Authorization",
					description: "Bearer token to access these api endpoints",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
	"/api/docs",
	swaggerUi.serve,
	swaggerUi.setup(specs, { explorer: true })
);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested, Content-Type, Accept Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
		return res.status(200).json({});
	}
	next();
});

//custom middleware
app.use((req, res, next) => {
	
	let token = null;

	if (req.headers.authorization) {
		token = req.headers.authorization.split(" ");
	}
	

	if (token && token[0] === "Bearer") {
		// verify token is valid
		jwt.verify(token[1], process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return console.error("Verification failed:", err);
			} else {
				// if token is valid set token to decoded information
				req.user = decoded;
			}
			// go to next middleware
			next();
		});
	} else {
		req.user = undefined;
		next();
	}
});
// routes
app.use("/api/users", require("./routes/users"));
app.use("/api/apps", require("./routes/apps"));
app.use("/api/reviews", require("./routes/reviews"));

app.listen(port, host, () => {
	console.log(`Example app listening on port ${port}`);
});
