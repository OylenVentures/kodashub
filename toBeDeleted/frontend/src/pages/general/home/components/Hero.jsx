import Button from "../../../../components/Button";
import {
  FaDrupal,
  FaJoomla,
  FaMagento,
  FaOpencart,
  FaWordpress,
} from "react-icons/fa";

function Hero() {
  return (
    <header className="flex items-center justify-center h-svh px-5 lg:px-20 bg-slate-900 bg-[url('./assets/servers.jpg')] bg-blend-overlay bg-center bg-cover bg-no-repeat">
      <div className='flex flex-col items-center gap-5 text-center text-slate-200 md:w-2/3 xl:w-2/5'>
        <h1>
          <span className='text-purple-700'>Reliable</span> &{" "}
          <span className='text-purple-700'>Affordable</span> Web Hosting
          Solutions
        </h1>
        <h5 className='mb-5'>
          Experience unparalleled web hosting and development services tailored
          to your needs. Join us and elevate your online presence.
        </h5>
        <Button url='/register' label='Get Started' />
        <div className='mt-10 grid grid-cols-5 gap-10 text-3xl md:text-6xl'>
          <FaWordpress />
          <FaDrupal />
          <FaJoomla />
          <FaMagento />
          <FaOpencart />
        </div>
      </div>
    </header>
  );
}

export default Hero;
