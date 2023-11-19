// check if a user is an admin
const checkRole = (req, res, next) => {
	const userRole = req.user?.role;

	if (userRole == "admin") {
		next();
	} else {
		res.status(403).json({ message: "Unauthorized, must be an Admin" });
	}
};

module.exports = { checkRole };
