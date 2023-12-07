const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Review = require("../models/review.model");

const register = async (req, res) => {
	try {
		// create new user
		let newUser = new User(req.body);
		// hash the password
		newUser.password = bcrypt.hashSync(req.body.password, 10);
		// save the user
		const user = await newUser.save();
		user.password = undefined;
		// create JWT token
		let token = jwt.sign(
			{
				email: user.email,
				role: user.role,
				_id: user._id,
			},
			process.env.JWT_SECRET
		);
		user.token = token;
		console.log(user)
		// return the user with the token
		return res.status(201).json({
			data: user
		});
	} catch (err) {
		return res.status(400).json({
			msg: err,
		});
	}
};

const login = async (req, res) => {
	try {
		// find by email
		let user = await User.findOne({ email: req.body.email });

		let token = null;

		if (!user || !user.comparePassword(req.body.password)) {
			return res.status(401).json({
				msg: "Authentication failed, username or password is wrong",
			});
		}
		// create JWT token
		token = jwt.sign(
			{
				email: user.email,
				role: user.role,
				_id: user._id,
			},
			process.env.JWT_SECRET
		);
		user.token = token;
		user.password = undefined;
		res.status(200).json({
			msg: "Login successful",
			data: {
				user,
				token
			},
		});
	} catch (err) {
		return res.status(400).json({
			msg: err,
		});
	}
};

const profile = async (req, res) => {
	try {
		const id = req.params.id;

		// get a user by id
		// populate it with selected properties
		const data = await User.findById(id)
			.populate({ path: "appsDownloaded", select: "_id name" })
			.populate({ path: "reviews", select: "_id content" });

		if (!data) {
			return res.status(404).json({ msg: `user ${id} not found` });
		}
		// return the user without password
		data.password = undefined;

		res.status(200).json(data);
	} catch (err) {
		if (err.name === "CastError") {
			res.status(404).json({ msg: `App ${id} not found` });
		} else {
			res.status(500).json(err);
		}

		console.error(`Error ${err}`);
	}
};

const deleteData = async (req, res) => {
	try {
		const id = req.params.id;

		// get user id
		const user = req.user;

		// find them by id
		const userToDelete = await User.findById(id);

		// check if they own the account or are they an admin
		// check if they exist
		if (!userToDelete) {
			res.status(404).json({ msg: `User ${id} not found` });
			return;
		}

		if (userToDelete._id == user._id || user.role == "admin") {
			// Delete user by id
			await User.findByIdAndDelete(id);

			// delete all reviews by user
			await Review.deleteMany({ user: id });

			res.status(200).json({
				msg: `User ${id} deleted`,
			});
		} else {
			return res
				.status(401)
				.json({ msg: `You are not authorized to delete this user` });
		}
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
	register,
	login,
	profile,
	deleteData,
};
