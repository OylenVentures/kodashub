import { FaEnvelopeOpen, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

function ContactLinks() {
  return (
    <section>
      <h3>Connect with us!</h3>
      <p>
        If you have general inquiries, please fill out the contact form, and we
        will get back to you as soon as possible.
      </p>
      <div className='mt-4 text-slate-200 space-y-5'>
        <Link
          to=''
          className='flex items-center justify-center gap-3 bg-purple-700 py-5 px-14 rounded-tl-full rounded-br-full hover:bg-opacity-70 ease-linear duration-300 max-w-96 mx-auto'>
          <FaEnvelopeOpen className='w-6 h-6' />
          <p>hq@kh.com</p>
        </Link>
        <Link
          to=''
          className='flex items-center justify-center gap-3 bg-purple-700 py-5 px-14 rounded-tl-full rounded-br-full hover:bg-opacity-70 ease-linear duration-300 max-w-96 mx-auto'>
          <FaWhatsapp className='w-6 h-6' />
          <p>+2348XXXXXXXXX</p>
        </Link>
        <Link
          to=''
          className='flex items-center justify-center gap-3 bg-purple-700 py-5 px-14 rounded-tl-full rounded-br-full hover:bg-opacity-70 ease-linear duration-300 max-w-96 mx-auto'>
          <FaTwitter className='w-6 h-6' />
          <p>@kodashub</p>
        </Link>
      </div>
    </section>
  );
}

export default ContactLinks;
