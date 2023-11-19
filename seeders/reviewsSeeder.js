// Import the necessary MongoDB packages
const MongoClient = require("mongodb").MongoClient;
const Review = require("../models/review.model");
const App = require("../models/app.model");
const User = require("../models/user.model");
const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const connectDB = async () => {
	let db;
	try {
		// Connect to the database
		await mongoose.connect(
			"mongodb+srv://stephengordon48:ovgG7i6MBFXKMoHe@cluster0.lksxmbv.mongodb.net/appstore?retryWrites=true&w=majority"
		);
		console.log("Connected to the database");

		// Get all users
		const users = await User.find({});

		// Perform database operations
		for (const user of users) {
			for (const app of user.appsDownloaded) {
				const review = {
					rating: Math.floor(Math.random() * 5) + 1,
					content: faker.lorem.paragraph(),
					user: user._id,
					app: app,
				};

				const createdReview = await Review.create(review);

				user.reviews.push(createdReview._id);
				await user.save();

				const appRef = await App.findById(app);
				appRef.reviews.push(createdReview._id);
				await appRef.save();
			}
		}

		console.log("Reviews added successfully");
	} catch (error) {
		console.error(error);
	} finally {
		// Disconnect from the database after all operations are complete
		await mongoose.disconnect();
	}
};

connectDB();
