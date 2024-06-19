import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  // State to manage form data (username and password)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // React Query hook for managing queries and mutations
  const queryClient = useQueryClient();

  // useMutation hook to handle login mutation
  const {
    mutate: loginMutation, // Function for triggering login mutation
    isPending, // Flag indicating if mutation is pending
    isError, // Flag indicating if mutation encountered an error
    error, // Error object if there's any error during mutation
  } = useMutation({
    // async function to perform login
    mutationFn: async ({ username, password }) => {
      try {
        // Sending POST request to login endpoint
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        // Parsing response data
        const data = await res.json();

        // Handling non-successful response
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        // Throwing error in case of any exception
        throw new Error(error);
      }
    },
    // onSuccess callback to invalidate authUser query after successful login
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData); // Triggering login mutation with form data
  };

  // Function to handle input change in the form fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // JSX structure for the login page
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left side - large screen */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>

          {/* Username input field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          {/* Password input field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          {/* Login button */}
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Login"}
          </button>

          {/* Error message if login fails */}
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>

        {/* Sign up link */}
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
