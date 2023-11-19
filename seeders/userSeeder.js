//https://fakerjs.dev/
//https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
// Import the necessary MongoDB packages
const MongoClient = require("mongodb").MongoClient;

const User = require("../models/user.model");
const App = require("../models/app.model");

const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

// get all the apps
// create 50 users
// for each user select 5 random apps and add them to the user

const connectDB = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://stephengordon48:ovgG7i6MBFXKMoHe@cluster0.lksxmbv.mongodb.net/appstore?retryWrites=true&w=majority"
		);
		console.log("connected to db");

		const apps = await App.find({});

		const generateUsers = (num) => {
			const users = [];

			for (let i = 0; i < num; i++) {
				const full_name = faker.person.fullName();
				const email = faker.internet.email();
				const password = faker.number.int();
				const userAppsDownloaded = [];

				for (let j = 0; j < 5; j++) {
					let randomApp = apps[Math.floor(Math.random() * apps.length)];
					userAppsDownloaded.push(randomApp._id);
				}

				users.push({
					full_name,
					email,
					password,
					appsDownloaded: userAppsDownloaded,
				});
			}

			return users;
		};
		const user = generateUsers(50);

		const users = await User.insertMany(user);
	} catch (error) {
		console.error(error);
	}
};
connectDB();
