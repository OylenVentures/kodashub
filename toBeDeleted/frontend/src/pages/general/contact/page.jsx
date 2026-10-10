import ContactForm from "./_components/ContactForm";
import ContactLinks from "./_components/ContactLinks";

function ContactPage() {
  return (
    <article>
      <div className='w-full md:w-1/2 rounded-br-full px-5 lg:px-20 text-slate-200 bg-purple-700'>
        <h1>Contact Us</h1>
      </div>
      <section className='flex flex-col gap-5 md:gap-40 md:flex-row md:h-[90vh] items-center justify-evenly py-10 px-5 lg:px-20 text-slate-700'>
        <ContactForm />
        <ContactLinks />
      </section>
    </article>
  );
}

export default ContactPage;
