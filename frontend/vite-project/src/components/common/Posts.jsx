import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
  // Function to determine the appropriate API endpoint based on the feed type
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all"; // Endpoint for "for you" feed
      case "following":
        return "/api/posts/following"; // Endpoint for "following" feed
      case "posts":
        return `/api/posts/user/${username}`; // Endpoint for posts by a specific user
      case "likes":
        return `/api/posts/likes/${userId}`; // Endpoint for posts liked by a specific user
      default:
        return "/api/posts/all"; // Default endpoint
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  // useQuery hook to fetch posts data from the API
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"], // Unique key for caching
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  // Refetch posts whenever feedType or username changes
  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
