const MongoClient = require("mongodb").MongoClient;
const Review = require("../models/review.model");
const App = require("../models/app.model");
const User = require("../models/user.model");
const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const reviewSeeder = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.DB_ATLAS_URL);
		console.log("Connected to the database");

		// Get all users
		const users = await User.find({});

		users.forEach(async (user) => {
			// loop through users
			user.appsDownloaded.forEach(async (app) => {
				// loop through apps downloaded by each user and create a review using faker
				const review = {
					rating: Math.floor(Math.random() * 5) + 1,
					content: faker.lorem.paragraph(),
					user: user._id,
					app: app,
				};

				// create the review
				const createdReview = await Review.create(review);

				user.reviews.push(createdReview._id);
				await user.save();

				// create the reference in the app
				const appRef = await App.findById(app);
				appRef.reviews.push(createdReview._id);
				await appRef.save();
			});
		});

		console.log("Reviews added");
	} catch (error) {
		console.error(error);
	}
};

reviewSeeder();
