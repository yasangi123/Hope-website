import mongoose from "mongoose";

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    // Unique username for each user (required, must be unique)
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // Full name of the user (required)
    fullName: {
      type: String,
      required: true,
    },
    // Password of the user (required, minimum length of 6 characters)
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    // Email of the user (required, must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // List of users who follow this user (references to User model, default empty array)
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    // List of users whom this user follows (references to User model, default empty array)
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    // URL of the user's profile image (default empty string)
    profileImg: {
      type: String,
      default: "",
    },
    // URL of the user's cover image (default empty string)
    coverImg: {
      type: String,
      default: "",
    },
    // Bio of the user (default empty string)
    bio: {
      type: String,
      default: "",
    },
    // Link associated with the user (default empty string)
    link: {
      type: String,
      default: "",
    },
    // List of posts liked by the user (references to Post model, default empty array)
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

export default User;
