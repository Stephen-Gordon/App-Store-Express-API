// Import the necessary MongoDB packages
const MongoClient = require("mongodb").MongoClient;
const App = require("../models/app.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_ATLAS_URL);
		console.log("connected to db");

		// get all users
		const users = await User.find({});

		users.forEach(async (user) => {
			// for each user get their appsDownloaded array
			user.appsDownloaded.forEach(async (app) => {
				// for each app push the user id to the users array
				const appData = await App.findById(app);
				appData.users.push(user._id);
				await appData.save();
			});
		});
	} catch (error) {
		console.error(error);
	}
};
connectDB();
