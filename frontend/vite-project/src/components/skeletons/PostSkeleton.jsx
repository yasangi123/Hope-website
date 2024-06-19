const PostSkeleton = () => {
	return (
	  <div className='flex flex-col gap-4 w-full p-4'> {/* Container for the skeleton post */}
		<div className='flex gap-4 items-center'> {/* Flex container for avatar and post header */}
		  <div className='skeleton w-10 h-10 rounded-full shrink-0'></div> {/* Avatar skeleton */}
		  <div className='flex flex-col gap-2'> {/* Container for post header text */}
			<div className='skeleton h-2 w-12 rounded-full'></div> {/* Skeleton for post header text line */}
			<div className='skeleton h-2 w-24 rounded-full'></div> {/* Another skeleton for post header text line */}
		  </div>
		</div>
		<div className='skeleton h-40 w-full'></div> {/* Skeleton for post content */}
	  </div>
	);
  };
  
  export default PostSkeleton;
  