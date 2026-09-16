const Feedback = () => {
  return (
    <section className='flex flex-col bg-white justify-center items-center min-h-svh'>
      <div className='bg-slate-200 p-4 rounded-lg space-y-5 text-center shadow-md md:w-3/5'>
        <h1 className='text-lime-500'>Successfull</h1>
        <h4>
          Thank you for your purchase! Your payment has been processed
          successfully.
        </h4>
        <h4>Your invoice will be updated within 24 hours.</h4>
      </div>
    </section>
  );
};

export default Feedback;
