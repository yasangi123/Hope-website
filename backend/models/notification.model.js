import mongoose from "mongoose";

// Define the schema for notifications
const notificationSchema = new mongoose.Schema(
	{
		// Sender of the notification (reference to User model)
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: true,
		},
		// Receiver of the notification (reference to User model)
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: true,
		},
		// Type of notification (follow or like)
		type: {
			type: String,
			required: true,
			enum: ["follow", "like"], // Only allow specified values
		},
		// Whether the notification has been read or not
		read: {
			type: Boolean,
			default: false, // Default value is false
		},
	},
	{ timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create a model based on the schema
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
