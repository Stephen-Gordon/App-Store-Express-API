const loginRequired = (req, res, next) => {
	// check if the user exists
	if (req.user) {
		next();
	} else {
		return res.status(401).json({
			msg: "Unauthorized, you mest be logged in to continue ",
		});
	}
};
module.exports = { loginRequired };
