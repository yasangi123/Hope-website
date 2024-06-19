import jwt from "jsonwebtoken";

// Function to generate a JWT token and set it as a cookie in the response
export const generateTokenAndSetCookie = (userId, res) => {
	// Generate a JWT token with the userId payload and a secret key
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d", // Token expiration time set to 15 days
	});

	// Set the JWT token as a cookie in the response
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (15 days)
		httpOnly: true, // Cookie is accessible only by the web server, preventing XSS attacks
		sameSite: "strict", // Restricts the cookie to same-site requests to prevent CSRF attacks
		secure: process.env.NODE_ENV !== "development", // Cookie is sent only over HTTPS in production
	});
};
