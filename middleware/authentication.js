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
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		req.user = {
			userId: decoded.userId,
			name: decoded.name,
		};
		next();
	} catch (error) {
		throw new UnauthenticatedError("Invalid token");
	}
};

module.exports = { authMiddleware };
