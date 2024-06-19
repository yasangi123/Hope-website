export const formatPostDate = (createdAt) => {
	// Get the current date and the date when the post was created
	const currentDate = new Date();
	const createdAtDate = new Date(createdAt);
  
	// Calculate time differences in seconds, minutes, hours, and days
	const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);
  
	// Determine the appropriate format based on the time difference
	if (timeDifferenceInDays > 1) {
	  // If more than 1 day ago, return the date in "Month Day" format
	  return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	} else if (timeDifferenceInDays === 1) {
	  // If exactly 1 day ago, return "1d"
	  return "1d";
	} else if (timeDifferenceInHours >= 1) {
	  // If hours ago, return the number of hours followed by "h"
	  return `${timeDifferenceInHours}h`;
	} else if (timeDifferenceInMinutes >= 1) {
	  // If minutes ago, return the number of minutes followed by "m"
	  return `${timeDifferenceInMinutes}m`;
	} else {
	  // If less than a minute ago, return "Just now"
	  return "Just now";
	}
  };
  
  export const formatMemberSinceDate = (createdAt) => {
	// Convert the createdAt timestamp to a Date object
	const date = new Date(createdAt);
	// Array of month names
	const months = [
	  "January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
  
	// Get the month and year from the Date object
	const month = months[date.getMonth()];
	const year = date.getFullYear();
  
	// Return a formatted string indicating when the user joined
	return `Joined ${month} ${year}`;
  };
  