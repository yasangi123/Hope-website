const RightPanelSkeleton = () => {
	return (
	  <div className='flex flex-col gap-2 w-52 my-2'> {/* Container for the right panel skeleton */}
		<div className='flex gap-2 items-center'> {/* Flex container for items with gaps and centered items */}
		  <div className='skeleton w-8 h-8 rounded-full shrink-0'></div> {/* Skeleton for a small rounded avatar */}
		  <div className='flex flex-1 justify-between'> {/* Flex container to distribute remaining space between items */}
			<div className='flex flex-col gap-1'> {/* Flex column for text content with gaps between items */}
			  <div className='skeleton h-2 w-12 rounded-full'></div> {/* Skeleton for a small line of text with rounded corners */}
			  <div className='skeleton h-2 w-16 rounded-full'></div> {/* Skeleton for another small line of text with rounded corners */}
			</div>
			<div className='skeleton h-6 w-14 rounded-full'></div> {/* Skeleton for a longer line of text with rounded corners */}
		  </div>
		</div>
	  </div>
	);
  };
  
  export default RightPanelSkeleton;
  