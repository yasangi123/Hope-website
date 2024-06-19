import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow"; // Custom hook to handle follow functionality

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton"; // Skeleton component for loading state
import LoadingSpinner from "./LoadingSpinner"; // Loading spinner component

const RightPanel = () => {
  // Fetch suggested users using useQuery from react-query
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"], // Unique key for caching
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested"); // Fetch suggested users from API endpoint
        const data = await res.json(); // Parse response
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!"); // Throw error if response is not ok
        }
        return data; // Return fetched data
      } catch (error) {
        throw new Error(error.message); // Throw error if fetch fails
      }
    },
  });

  const { follow, isPending } = useFollow(); // Custom hook to handle follow functionality

  // Render nothing if there are no suggested users
  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg sticky top-2">
        <p className="font-bold text-white mb-4">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            // Render skeleton components while loading
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt={user.fullName}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight text-white truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-gray-300">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  {/* Follow button */}
                  <button
                    className="btn bg-blue-500 text-white hover:bg-blue-600 rounded-full btn-sm px-4 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id); // Call follow function on button click
                    }}
                    disabled={isPending} // Disable button if follow action is pending
                  >
                    {isPending ? ( // Show loading spinner if follow action is pending
                      <LoadingSpinner size="sm" />
                    ) : (
                      "Follow" // Show "Follow" text if not pending
                    )}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
