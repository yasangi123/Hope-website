const ProfileHeaderSkeleton = () => {
	return (
	  <div className='flex flex-col gap-2 w-full my-2 p-4'> {/* Container for the profile header skeleton */}
		<div className='flex gap-2 items-center'> {/* Flex container for profile header content */}
		  <div className='flex flex-1 gap-1'> {/* Flex container with gaps */}
			<div className='flex flex-col gap-1 w-full'> {/* Flex column container for profile header details */}
			  <div className='skeleton h-4 w-12 rounded-full'></div> {/* Skeleton for a small line of text */}
			  <div className='skeleton h-4 w-16 rounded-full'></div> {/* Skeleton for another small line of text */}
			  <div className='skeleton h-40 w-full relative'> {/* Skeleton for the profile image section */}
				<div className='skeleton h-20 w-20 rounded-full border absolute -bottom-10 left-3'></div> {/* Skeleton for the profile image, with an absolute position */}
			  </div>
			  <div className='skeleton h-6 mt-4 w-24 ml-auto rounded-full'></div> {/* Skeleton for a longer line of text */}
			  <div className='skeleton h-4 w-14 rounded-full mt-4'></div> {/* Skeleton for a small line of text with rounded corners */}
			  <div className='skeleton h-4 w-20 rounded-full'></div> {/* Skeleton for another small line of text */}
			  <div className='skeleton h-4 w-2/3 rounded-full'></div> {/* Skeleton for a wider line of text */}
			</div>
		  </div>
		</div>
	  </div>
	);
  };
  
  export default ProfileHeaderSkeleton;
  