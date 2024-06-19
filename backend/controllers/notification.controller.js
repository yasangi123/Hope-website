import Notification from "../models/notification.model.js"; // Importing the Notification model from the models directory

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id; // Getting the user ID from the request object

		// Find notifications for the user, populating the 'from' field with the username and profile image
		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});

		// Mark all notifications as read for the user
		await Notification.updateMany({ to: userId }, { read: true });

		// Respond with the notifications
		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteNotifications = async (req, res) => {
	try {
		const userId = req.user._id; // Getting the user ID from the request object

		// Delete all notifications for the user
		await Notification.deleteMany({ to: userId });

		// Respond with a success message
		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
