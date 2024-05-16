const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization || !authorization.startsWith("Bearer ")) {
		throw new UnauthenticatedError("Unauthorized");
	}
	const token = authorization.split(" ")[1];
	try {
		// const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// req.user = {
		// 	userId: decoded.userId,
		// 	name: decoded.name,
		// };
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		throw new UnauthenticatedError("Invalid token");
	}
};

module.exports = { authMiddleware };
