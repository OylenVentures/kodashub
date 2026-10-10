export default function FAQ() {
  const faqsList = [
    {
      q: "What services does KodasHub offer?",
      a: "We offer web hosting, web development, and a variety of other services to help your business grow.",
    },
    {
      q: "Can KodasHub handle e-commerce projects?",
      a: "Yes, we provide comprehensive e-commerce solutions to enhance your online store.",
    },
    {
      q: "How do I start a web development project with KodasHub?",
      a: "Schedule a consultation with us to discuss your needs and we'll help you get started.",
    },
  ];

  return (
    <section className='leading-relaxed max-w-screen-xl mt-12 mx-auto py-10 px-5 lg:px-20'>
      <div className='space-y-3 text-center'>
        <h3 className='text-3xl text-purple-600 font-semibold'>
          Frequently Asked Questions
        </h3>
        <p className='text-gray-600 max-w-lg mx-auto text-lg'>
          Still confused? feel free to contact us.
        </p>
      </div>
      <div className='my-8 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
        {faqsList.map((item, idx) => (
          <div className='space-y-3 mt-5' key={idx}>
            <h4 className='text-xl text-gray-700 font-medium'>{item.q}</h4>
            <p className='text-gray-500'>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
