//https://fakerjs.dev/
//https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array

const MongoClient = require("mongodb").MongoClient;

const User = require("../models/user.model");
const App = require("../models/app.model");

const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

// get all the apps
// create 50 users

// userSeeder
const userSeeder = async () => {
	try {
		await mongoose.connect(process.env.DB_ATLAS_URL);
		console.log("connected to db");

		const apps = await App.find({});

		const generateUsers = (num) => {
			const users = [];

			for (let i = 0; i < num; i++) {
				// faker
				const full_name = faker.person.fullName();
				const email = faker.internet.email();
				const password = faker.number.int();
				const userAppsDownloaded = [];

				// for each user select 5 random apps and add them to the user
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

		await User.insertMany(user);
	} catch (error) {
		console.error(error);
	}
};
userSeeder();
