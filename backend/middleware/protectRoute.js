import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes by ensuring the user is authenticated
export const protectRoute = async (req, res, next) => {
	try {
		// Retrieve the JWT token from cookies
		const token = req.cookies.jwt;

		// If no token is provided, return an unauthorized error
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		// Verify the token using the secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// If the token is invalid, return an unauthorized error
		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		// Find the user by the ID encoded in the token, excluding the password field
		const user = await User.findById(decoded.userId).select("-password");

		// If the user is not found, return a not found error
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach the user object to the request object for access in subsequent middleware/routes
		req.user = user;

		// Call the next middleware or route handler
		next();
	} catch (err) {
		// Log any errors and return a server error response
		console.log("Error in protectRoute middleware", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
