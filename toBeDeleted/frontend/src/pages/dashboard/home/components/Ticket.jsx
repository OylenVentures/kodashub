import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import support from "../../../../assets/va.png";

export default function Ticket() {
  const [data, setData] = useState({
    subject: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setInterval(() => {
      setData({ ...data, [e.target.name]: e.target.value });
    }, 500);
  };

  const sendMail = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URI}/api/supportmail`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((resp) => {
        if (resp.ok) {
          setData({
            subject: "",
            message: "",
          });
          toast.success("Email sent successfully");
        } else {
          toast.error("Unable to send mail!");
        }
      })
      .catch((error) => toast.error(error));
  };

  useEffect(() => {
    setData({ ...data, email: sessionStorage.getItem("user") });
  }, []);

  return (
    <section className='p-5 bg-white rounded shadow-md flex gap-5 justify-center'>
      <div className='flex-1'>
        <h2 className='text-3xl font-bold text-purple-600 mb-4'>
          Contact Support
        </h2>

        <form onSubmit={sendMail}>
          <label className='block mb-2'>
            <span className='text-gray-700'>Subject</span>
            <input
              type='text'
              name='subject'
              value={data.subject}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
              placeholder='Enter your mail subject'
              required
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Email</span>
            <input
              type='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              readOnly
              required
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-md outline-none'
              placeholder='Enter your email address'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Message</span>
            <textarea
              id='message'
              name='message'
              cols={30}
              rows={5}
              value={data.message}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
              required
              placeholder='Enter your email address'></textarea>
          </label>

          <button
            type='submit'
            className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
            Send
          </button>
        </form>
      </div>

      <div className='hidden md:block flex-1'>
        <img
          src={support}
          className='object-fill w-full h-full'
          width={300}
          height={300}
          alt='banner'
        />
      </div>
    </section>
  );
}
