// middleware/roleMiddleware.js
const checkRole = (requiredRole) => (req, res, next) => {
  const userRole = req.user ? req.user.role : null;

  if (userRole && userRole === requiredRole) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = { checkRole };
