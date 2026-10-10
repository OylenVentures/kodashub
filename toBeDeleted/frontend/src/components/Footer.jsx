import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();
  const footerMenu = [
    { label: "Home", link: "/" },
    { label: "Services", link: "/services" },
    { label: "Contact", link: "/contact" },
  ];

  const socialLink = [
    {
      label: "Facebook",
      url: "https://m.facebook.com/kodashub",
      icon: <FaFacebook />,
    },
    { label: "Twitter", url: "https://m.x.com/kodashub", icon: <FaTwitter /> },
    // { label: "Instagram", url: "/", icon: <FaInstagram /> },
    // { label: "LinkedIn", url: "/", icon: <FaLinkedin /> },
  ];

  return (
    <footer className='bg-gray-200 p-5 lg:px-20'>
      <div className='flex flex-wrap justify-between'>
        <div className='w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 md:mb-0'>
          <img src={logo} alt='Logo' className='w-32 h-32 object-fill mb-4' />
          <p className='text-gray-700'>
            Reliable web hosting provider for business scallability...
          </p>
        </div>

        <div className='w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 md:mb-0'>
          <h4 className='font-bold text-purple-600 mb-2'>Quick Links</h4>
          <ul className='space-y-2'>
            {footerMenu.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className='text-lg text-gray-700 hover:text-purple-600'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 md:mb-0'>
          <h4 className='font-bold text-purple-600 mb-2'>Social Media</h4>
          <ul className='space-y-2'>
            {socialLink.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.url}
                  className='flex gap-1 items-center text-lg text-gray-700 hover:text-purple-600'
                  target='_blank'>
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className='my-3 text-gray-700 text-center'>
        &copy; {year} :: All rights reserverd
      </p>
    </footer>
  );
}
