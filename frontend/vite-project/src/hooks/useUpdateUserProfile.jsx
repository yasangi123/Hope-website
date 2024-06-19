import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Custom hook to handle user profile update functionality
const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  // useMutation hook to handle profile update mutation
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    // async function to perform profile update
    mutationFn: async (formData) => {
      try {
        // Sending POST request to update profile endpoint
        const res = await fetch(`/api/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Parsing response data
        const data = await res.json();

        // Handling non-successful response
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        // Returning updated profile data
        return data;
      } catch (error) {
        // Throwing error in case of any exception
        throw new Error(error.message);
      }
    },
    // onSuccess callback to handle successful profile update
    onSuccess: () => {
      // Displaying success toast message
      toast.success("Profile updated successfully");

      // Invalidating authUser and userProfile queries to update UI
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    // onError callback to handle error during profile update
    onError: (error) => {
      // Displaying error toast message
      toast.error(error.message);
    },
  });

  // Returning updateProfile function and isUpdatingProfile flag
  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
