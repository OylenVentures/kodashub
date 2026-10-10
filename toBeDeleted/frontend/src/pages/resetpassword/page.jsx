import { useState } from "react";

const ForgotPassword = () => {
  const [formInput, setFormInput] = useState({ email: "" });
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URI}/api/forgotpassword`, {
        method: "PATCH",
        body: JSON.stringify(formInput),
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((resp) => {
          if (resp?.ok) {
            setFormInput({ email: "" });
            setFeedback("Please check your mail for password reset link");
          } else {
            setErrorMsg(resp.statusText);
          }
        })
        .catch((err) => setErrorMsg(err));
    } catch (error) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <article className='bg-purple-100 h-screen flex justify-center items-center py-10 px-5 lg:px-20'>
      <form onSubmit={handleSend} className='auth-form'>
        <h3>Forgot password</h3>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            id='email'
            className='p-2 rounded-md border w-full'
            value={formInput.email}
            onChange={(e) =>
              setFormInput({ ...formInput, [e.target.name]: e.target.value })
            }
            placeholder='adapam@gmail.com'
            required
          />
        </div>

        <button className='btn'>Send</button>
        {feedback ? (
          <p className='text-lime-500 te'>{feedback}</p>
        ) : (
          errorMsg && <p className='text-red-500 text-center'>{errorMsg}</p>
        )}
      </form>
    </article>
  );
};

export default ForgotPassword;
