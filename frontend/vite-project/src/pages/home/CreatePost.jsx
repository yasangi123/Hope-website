import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  // State variables for managing text content and image
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null); // Ref for file input

  // Querying authenticated user data
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Query Client instance
  const queryClient = useQueryClient();

  // useMutation hook to handle post creation
  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    // async function to perform post creation
    mutationFn: async ({ text, img }) => {
      try {
        // Sending POST request to create post endpoint
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });

        // Parsing response data
        const data = await res.json();

        // Handling non-successful response
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        // Returning data in case of successful post creation
        return data;
      } catch (error) {
        // Throwing error in case of any exception
        throw new Error(error);
      }
    },

    // onSuccess callback to reset form, show success toast, and invalidate posts query
    onSuccess: () => {
      setText(""); // Clearing text state
      setImg(null); // Clearing image state
      toast.success("Post created successfully"); // Showing success toast message
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidating posts query
    },
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    createPost({ text, img }); // Triggering createPost mutation with form data
  };

  // Function to handle image selection from file input
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result); // Setting selected image as base64 URL
      };
      reader.readAsDataURL(file); // Reading file as data URL
    }
  };

  // JSX structure for the create post component
  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      {/* Avatar */}
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImg || "/avatar-placeholder.png"} alt="Profile" />
        </div>
      </div>

      {/* Form for creating a post */}
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        {/* Text area for post content */}
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Display selected image */}
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null); // Clearing selected image state
                imgRef.current.value = null; // Resetting file input value
              }}
            />
            <img src={img} className="w-full mx-auto h-72 object-contain rounded" alt="Selected" />
          </div>
        )}

        {/* Image upload and submit button */}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          {/* Button to trigger image selection */}
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()} // Triggering file input click
            />
          </div>
          <input type="file" accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />

          {/* Button to submit the post */}
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Error message if post creation fails */}
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
