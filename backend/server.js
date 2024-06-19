import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config(); // Load environment variables from .env file

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
}); // Configure Cloudinary for image uploads

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // Middleware to parse JSON bodies (limiting payload size to 5mb)
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for form data)

app.use(cookieParser()); // Middleware to parse cookies from incoming requests

app.use("/api/auth", authRoutes); // Route handler for authentication endpoints
app.use("/api/users", userRoutes); // Route handler for user-related endpoints
app.use("/api/posts", postRoutes); // Route handler for post-related endpoints
app.use("/api/notifications", notificationRoutes); // Route handler for notification-related endpoints

if (process.env.NODE_ENV === "production") {
	// Serve static files from the frontend/dist directory in production mode
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// Fallback route to serve index.html for any other route not handled by API routes
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB(); // Connect to MongoDB when the server starts
});
