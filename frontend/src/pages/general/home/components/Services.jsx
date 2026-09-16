import web from "../../../../assets//web.jpg";
import servers from "../../../../assets//servers.jpg";

function Services() {
  return (
    <section className='max-w-7xl w-full py-10 px-5 lg:px-20'>
      <h3 className='text-3xl text-center font-bold text-purple-600 mb-4'>
        Our Services
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='bg-purple-100 p-4 rounded shadow-md'>
          <img
            src={web}
            alt='Web Design'
            className='w-full h-64 object-cover mb-4'
          />
          <h3 className='text-lg font-bold text-purple-600 mb-2'>
            Web Design Services
          </h3>
          <p className='text-gray-700'>
            We offer professional web design services to help you create a
            stunning online presence. Our team of experts will work with you to
            design a website that meets your needs and exceeds your
            expectations.
          </p>
          <ul className='list-disc pl-4'>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-purple-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Custom website design
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-purple-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Responsive design for mobile and tablet devices
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-purple-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Easy-to-use content management system
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-purple-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Search engine optimization (SEO) techniques
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-purple-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Fast and reliable hosting options
            </li>
          </ul>
        </div>
        <div className='bg-blue-100 p-4 rounded shadow-md'>
          <img
            src={servers}
            alt='Hosting'
            className='w-full h-64 object-cover mb-4'
          />
          <h3 className='text-lg font-bold text-blue-600 mb-2'>
            Hosting Services
          </h3>
          <p className='text-gray-700'>
            We offer reliable and secure hosting services to help you keep your
            website online and running smoothly. Our hosting plans include fast
            servers, ample storage, and expert support.
          </p>
          <ul className='list-disc pl-4'>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-indigo-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Fast and reliable servers
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-indigo-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Ample storage and bandwidth options
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-indigo-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Expert support and maintenance
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-indigo-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Secure and protected servers
            </li>
            <li className='flex items-center gap-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-indigo-600'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
              Easy-to-use control panel
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Services;
