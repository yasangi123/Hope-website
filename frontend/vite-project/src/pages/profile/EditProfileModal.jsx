import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  // Custom hook to handle updating user profile
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  // Function to update form data on input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Effect to populate form data when authUser changes
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      {/* Button to trigger the modal */}
      <button
        className='btn btn-outline rounded-full btn-sm'
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Edit profile
      </button>

      {/* Modal dialog for editing profile */}
      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box border rounded-md border-gray-700 shadow-md'>
          <h3 className='font-bold text-lg my-3'>Update Profile</h3>
          <form
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData); // Call updateProfile function on form submission
            }}
          >
            {/* Full Name and Username inputs */}
            <div className='flex flex-wrap gap-2'>
              <input
                type='text'
                placeholder='Full Name'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.fullName}
                name='fullName'
                onChange={handleInputChange}
              />
              <input
                type='text'
                placeholder='Username'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.username}
                name='username'
                onChange={handleInputChange}
              />
            </div>

            {/* Email and Bio textarea */}
            <div className='flex flex-wrap gap-2'>
              <input
                type='email'
                placeholder='Email'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.email}
                name='email'
                onChange={handleInputChange}
              />
              <textarea
                placeholder='Bio'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.bio}
                name='bio'
                onChange={handleInputChange}
              />
            </div>

            {/* Current Password and New Password inputs */}
            <div className='flex flex-wrap gap-2'>
              <input
                type='password'
                placeholder='Current Password'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.currentPassword}
                name='currentPassword'
                onChange={handleInputChange}
              />
              <input
                type='password'
                placeholder='New Password'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.newPassword}
                name='newPassword'
                onChange={handleInputChange}
              />
            </div>

            {/* Link input */}
            <input
              type='text'
              placeholder='Link'
              className='flex-1 input border border-gray-700 rounded p-2 input-md'
              value={formData.link}
              name='link'
              onChange={handleInputChange}
            />

            {/* Submit button */}
            <button className='btn btn-primary rounded-full btn-sm text-white'>
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        
        {/* Modal close button */}
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
