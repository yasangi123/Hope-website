import Notification from "../models/notification.model.js"; // Importing the Notification model
import Post from "../models/post.model.js"; // Importing the Post model
import User from "../models/user.model.js"; // Importing the User model
import { v2 as cloudinary } from "cloudinary"; // Importing Cloudinary for image uploads

export const createPost = async (req, res) => {
	try {
		const { text } = req.body; // Destructuring text from the request body
		let { img } = req.body; // Destructuring img from the request body
		const userId = req.user._id.toString(); // Getting the user ID from the request object

		const user = await User.findById(userId); // Finding the user by ID
		if (!user) return res.status(404).json({ message: "User not found" }); // Returning an error if user is not found

		// Checking if the post has either text or image
		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		// If there's an image, upload it to Cloudinary
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url; // Setting img to the URL of the uploaded image
		}

		// Creating a new post with the user ID, text, and image
		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save(); // Saving the new post to the database
		res.status(201).json(newPost); // Responding with the newly created post
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error); // Logging the error
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id); // Finding the post by ID
		if (!post) {
			return res.status(404).json({ error: "Post not found" }); // Returning an error if post is not found
		}

		// Checking if the user is authorized to delete the post
		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		// If the post has an image, delete it from Cloudinary
		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id); // Deleting the post from the database

		res.status(200).json({ message: "Post deleted successfully" }); // Responding with a success message
	} catch (error) {
		console.log("Error in deletePost controller: ", error); // Logging the error
		res.status(500).json({ error: "Internal server error" });
	}
};

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body; // Destructuring text from the request body
		const postId = req.params.id; // Getting the post ID from the request parameters
		const userId = req.user._id; // Getting the user ID from the request object

		if (!text) {
			return res.status(400).json({ error: "Text field is required" }); // Returning an error if text is missing
		}

		const post = await Post.findById(postId); // Finding the post by ID

		if (!post) {
			return res.status(404).json({ error: "Post not found" }); // Returning an error if post is not found
		}

		const comment = { user: userId, text }; // Creating a comment object with user ID and text

		post.comments.push(comment); // Adding the comment to the post's comments array
		await post.save(); // Saving the updated post

		res.status(200).json(post); // Responding with the updated post
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error); // Logging the error
		res.status(500).json({ error: "Internal server error" });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id; // Getting the user ID from the request object
		const { id: postId } = req.params; // Getting the post ID from the request parameters

		const post = await Post.findById(postId); // Finding the post by ID

		if (!post) {
			return res.status(404).json({ error: "Post not found" }); // Returning an error if post is not found
		}

		const userLikedPost = post.likes.includes(userId); // Checking if the user already liked the post

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } }); // Removing the user ID from the post's likes array
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } }); // Removing the post ID from the user's likedPosts array

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString()); // Updating the likes array
			res.status(200).json(updatedLikes); // Responding with the updated likes array
		} else {
			// Like post
			post.likes.push(userId); // Adding the user ID to the post's likes array
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } }); // Adding the post ID to the user's likedPosts array
			await post.save(); // Saving the updated post

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			}); // Creating a new notification for the like action
			await notification.save(); // Saving the notification

			const updatedLikes = post.likes; // Updating the likes array
			res.status(200).json(updatedLikes); // Responding with the updated likes array
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error); // Logging the error
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllPosts = async (req, res) => {
	try {
		// Fetching all posts, sorting by creation date, and populating user and comments fields
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]); // Responding with an empty array if no posts are found
		}

		res.status(200).json(posts); // Responding with the fetched posts
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error); // Logging the error
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id; // Getting the user ID from the request parameters

	try {
		const user = await User.findById(userId); // Finding the user by ID
		if (!user) return res.status(404).json({ error: "User not found" }); // Returning an error if user is not found

		// Fetching posts that the user has liked, populating user and comments fields
		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts); // Responding with the liked posts
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error); // Logging the error
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id; // Getting the user ID from the request object
		const user = await User.findById(userId); // Finding the user by ID
		if (!user) return res.status(404).json({ error: "User not found" }); // Returning an error if user is not found

		const following = user.following; // Getting the list of users the current user is following

		// Fetching posts from the users the current user is following, sorting by creation date, and populating user and comments fields
		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts); // Responding with the fetched posts
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error); // Logging the error
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params; // Getting the username from the request parameters

		const user = await User.findOne({ username }); // Finding the user by username
		if (!user) return res.status(404).json({ error: "User not found" }); // Returning an error if user is not found

		// Fetching posts by the user, sorting by creation date, and populating user and comments fields
		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts); // Responding with the fetched posts
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error); // Logging the error
		res.status(500).json({ error: "Internal server error" });
	}
};
