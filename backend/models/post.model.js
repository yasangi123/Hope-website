import mongoose from "mongoose";

// Define the schema for posts
const postSchema = new mongoose.Schema(
	{
		// User who created the post (reference to User model)
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: true,
		},
		// Text content of the post (optional)
		text: {
			type: String,
		},
		// URL of an image attached to the post (optional)
		img: {
			type: String,
		},
		// Users who liked the post (references to User model)
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", // Reference to the User model
			},
		],
		// Comments on the post
		comments: [
			{
				// Text content of the comment (required)
				text: {
					type: String,
					required: true,
				},
				// User who made the comment (reference to User model, required)
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User", // Reference to the User model
					required: true,
				},
			},
		],
	},
	{ timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create a model based on the schema
const Post = mongoose.model("Post", postSchema);

export default Post;
