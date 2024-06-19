import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Custom hook to handle user follow functionality
const useFollow = () => {
  const queryClient = useQueryClient();

  // useMutation hook to handle follow mutation
  const { mutate: follow, isPending } = useMutation({
    // async function to perform follow action
    mutationFn: async (userId) => {
      try {
        // Sending POST request to follow user endpoint
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        });

        // Parsing response data
        const data = await res.json();

        // Handling non-successful response
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }

        // Returning after successful follow
        return;
      } catch (error) {
        // Throwing error in case of any exception
        throw new Error(error.message);
      }
    },
    // onSuccess callback to handle successful follow action
    onSuccess: () => {
      // Invalidating suggestedUsers and authUser queries to update UI
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    // onError callback to handle error during follow action
    onError: (error) => {
      // Displaying error toast message
      toast.error(error.message);
    },
  });

  // Returning follow function and isPending flag
  return { follow, isPending };
};

export default useFollow;
