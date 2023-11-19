const App = require("../models/app.model");
const User = require("../models/user.model");
const Review = require("../models/review.model");
const fs = require("fs");

const deleteImage = (filename) => {
	let path = `public/uploads/${filename}`;
	fs.access(path, fs.constants.F_OK, (err) => {
		err
			? console.log(err)
			: fs.unlink(path, (err) => {
					if (err) throw err;
					console.log(`${filename} was deleted`);
			  });
	});
};

const readData = async (req, res) => {
	try {
		const data = await App.find({})
			.populate({
				path: "users",
				select: "full_name email _id",
			})
			.populate({
				path: "reviews",
				select: "_id content rating user",
			});

		if (!data) {
			return res.status(404).json({ msg: `App ${id} not found` });
		}

		//loop through all apps, and its reviews
		// calculate the average rating and add it to the app
		let apps = data.map((app) => {
			let reviews = app.reviews;
			let total = 0;
			reviews.forEach((review) => {
				total = total + review.rating;
			});
			app.averageRating = total / reviews.length;
			return app;
		});

		// return the apps array
		data ? res.status(200).json(apps) : res.status(404).json("none found");
	} catch (err) {
		console.error(`Error ${err}`);
		res.status(500).json(err);
	}
};

const readOne = async (req, res) => {
	try {
		let id = req.params.id;

		const data = await App.findById(id)
			.populate({
				path: "users",
				select: "-password -createdAt -updatedAt -appsDownloaded -role",
			})
			.populate({
				path: "reviews",
				select: "_id content rating user",
			});

		if (!data) {
			return res.status(404).json({ msg: `App ${id} not found` });
		}

		// calculate the average rating and add it to the app

		if (data.reviews.length > 0) {
			let reviews = data.reviews;

			let total = 0;
			reviews.forEach((review) => {
				total = total + review.rating;
			});

			data.averageRating = total / reviews.length;
			data.averageRating = data.averageRating.toFixed(1);
		}
		console.log(data.averageRating);

		!data
			? res.status(404).json({ msg: `app ${id} not found` })
			: res.status(200).json(data);
	} catch (err) {
		//Check for cast Error
		err.name == "CastError"
			? res.status(404).json({ msg: `App ${id} not found` })
			: res.status(500).json(err);

		console.error(`Error ${err}`);
	}
};

const createData = async (req, res) => {
	try {
		const inputData = req.body;

		// Check for image
		console.log("file", req.file);
		if (req.file) {
			inputData.image_path = req.file.filename;
		}

		const data = await App.create(inputData);

		res.status(201).json(data);
	} catch (err) {
		console.log(err);
		err.name == "ValidationError"
			? res.status(422).json.error
			: res.status(500).json;
	}
};

const updateData = async (req, res) => {
	try {
		let id = req.params.id;
		let data = req.body;

		// check if theres a new image
		if (req.file) {
			data.image_path = req.file.filename;

			// get the old app
			const oldData = await App.findById(id);
			// delete its old image if it exists
			if (oldData.image_path) {
				deleteImage(oldData.image_path);
			}
		}

		// update the app with new data
		const newData = await App.findByIdAndUpdate(id, data, { new: true });
		if (!newData) {
			return res.status(404).json({ msg: `App ${id} not found` });
		}
		// update the users appsDownloaded
		newData.users.forEach(async (user) => {
			const updatedUser = await User.findByIdAndUpdate(
				user,
				{ $push: { appsDownloaded: id } },
				{ new: true }
			);
		});

		res.status(201).json({
			msg: `You Updated App ${id}`,
			data: newData,
		});
	} catch (err) {
		// Check for cast Error
		if (err.name === "CastError") {
			res.status(404).json({ msg: `App ${id} not found` });
		} else {
			console.error(`Error updating app: ${err}`);
			res.status(500).json(err);
		}
	}
};

const deleteData = async (req, res) => {
	try {
		//app id
		const id = req.params.id;

		// first delete the app
		const deleteApp = await App.findByIdAndDelete(id);

		if (!deleteApp) {
			res.status(404).json({ msg: `App ${id} not found` });
			return;
		}

		// Delete Image
		if (deleteApp.image_path) {
			deleteImage(deleteApp.image_path);
		}

		// map through the users and delete each review related to the app
		const reviewsToDeleteArray = deleteApp.reviews;

		// updateMany(filter, update, options)
		await Promise.all(
			reviewsToDeleteArray.map(async (reviewId) => {
				// pull the review by id from the users reviews array
				await User.updateMany(
					{ reviews: reviewId },
					{ $pull: { reviews: reviewId } }
				);
			})
		);

		// Delete the app from all users who have it downloaded
		await User.updateMany(
			{ appsDownloaded: id },
			{ $pull: { appsDownloaded: id } }
		);

		// Delete all the app's reviews
		await Review.deleteMany({ app: id });

		res.status(200).json({
			msg: `You deleted App ${id}`,
			data: deleteApp,
		});
	} catch (err) {
		if (err.name === "CastError") {
			res.status(404).json({ msg: `App ${id} not found` });
		} else {
			res.status(500).json(err);
		}

		console.error(`Error ${err}`);
	}
};

module.exports = {
	readData,
	readOne,
	createData,
	updateData,
	deleteData,
};
