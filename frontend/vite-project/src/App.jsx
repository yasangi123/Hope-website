import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
    // Fetching authenticated user data
    const { data: authUser, isLoading } = useQuery({
        // Unique key to identify the query
        queryKey: ["authUser"],
        // Function to fetch user data
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                // Handle errors from API response
                if (data.error) return null;
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                // Log user data received from API
                console.log("authUser is here:", data);
                return data;
            } catch (error) {
                // Throw error if fetch fails
                throw new Error(error);
            }
        },
        // Disable automatic retry on error
        retry: false,
    });

    // Render loading spinner while fetching user data
    if (isLoading) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }

    // Render the main application structure once loading is complete
    return (
        <div className='flex max-w-6xl mx-auto'>
            {/* Render sidebar if user is authenticated */}
            {authUser && <Sidebar />}
            {/* Routing setup using react-router-dom */}
            <Routes>
                {/* Route to home page if authenticated, otherwise navigate to login page */}
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
                {/* Route to login page if not authenticated */}
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
                {/* Route to signup page if not authenticated */}
                <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
                {/* Route to notifications page if authenticated, otherwise navigate to login page */}
                <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
                {/* Route to user profile page if authenticated, otherwise navigate to login page */}
                <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
            </Routes>
            {/* Render right panel if user is authenticated */}
            {authUser && <RightPanel />}
            {/* Toast notifications component */}
            <Toaster />
        </div>
    );
}

export default App;
