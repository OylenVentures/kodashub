import { useState } from "react";

function ContactForm() {
  const [data, setData] = useState({
    subject: "",
    full_name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const sendMail = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URI}/api/supportmail`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          setData({
            subject: "",
            full_name: "",
            email: "",
            message: "",
          });
          toast.success("Email sent successfully");
        } else {
          toast.error("Unable to send mail!");
        }
      })
      .catch((error) => toast.error(error));
  };

  return (
    <form
      onSubmit={sendMail}
      className='flex flex-col gap-5 w-full max-w-[550px] border border-purple-700 p-5 rounded-xl'>
      <h3>Questions or Feedback?</h3>
      <input
        type='text'
        name='subject'
        value={data.subject}
        onChange={handleChange}
        className='form-input'
        placeholder='Enter your mail subject'
        required
      />
      <input
        type='text'
        name='full_name'
        value={data.full_name}
        onChange={handleChange}
        className='form-input'
        placeholder='Enter your full name'
        required
      />
      <input
        type='email'
        name='email'
        value={data.email}
        onChange={handleChange}
        className='form-input'
        placeholder='Enter your email address'
        required
      />
      <textarea
        name='message'
        value={data.message}
        onChange={handleChange}
        className='form-input resize-y'
        cols={30}
        rows={5}
        required
        placeholder='Write your meesage here...'></textarea>
      <button className='btn'>Send</button>
    </form>
  );
}

export default ContactForm;
