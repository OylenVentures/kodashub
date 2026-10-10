const Loading = () => {
  return (
    <div className='flex justify-center items-center p-20 relative'>
      <div
        className='animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-purple-500 rounded-full'
        role='status'
        aria-label='loading'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
