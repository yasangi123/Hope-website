import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"; // Importing the utility function for token generation and setting cookies
import User from "../models/user.model.js"; // Importing the User model from the models directory
import bcrypt from "bcryptjs"; // Importing bcryptjs for password hashing

export const signup = async (req, res) => {
	try {
		const { fullName, username, email, password } = req.body; // Destructuring user details from the request body

		// Validate email format using regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		// Check if username already exists in the database
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		// Check if email already exists in the database
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		// Ensure password is at least 6 characters long
		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		// Generate salt and hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user instance with the provided details
		const newUser = new User({
			fullName,
			username,
			email,
			password: hashedPassword,
		});

		// If user instance is successfully created, save the user and set a token cookie
		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res); // Set the JWT token in the cookie
			await newUser.save(); // Save the new user to the database

			// Respond with the created user's details
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body; // Destructuring username and password from the request body
		const user = await User.findOne({ username }); // Find user by username

		// Compare the provided password with the hashed password stored in the database
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		// If user is not found or password is incorrect, return an error
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// Set a token cookie for the user upon successful login
		generateTokenAndSetCookie(user._id, res);

		// Respond with the logged-in user's details
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = async (req, res) => {
	try {
		// Clear the JWT cookie by setting its maxAge to 0
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMe = async (req, res) => {
	try {
		// Find the user by ID, excluding the password from the response
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user); // Respond with the user's details
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
