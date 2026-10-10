import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const route = useNavigate();
  const { token } = useParams();
  const [formInput, setFormInput] = useState({ password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `${import.meta.env.VITE_API_URI}/api/resetpassword/${token}`,
        {
          method: "PATCH",
          body: JSON.stringify(formInput),
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        }
      )
        .then((resp) => {
          if (resp?.ok) {
            toast.success("Password updated");
            route("/login");
          } else {
            toast.error(resp.statusText);
          }
        })
        .catch((err) => toast.error(err));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <article className='bg-purple-100 h-screen flex justify-center items-center py-10 px-5 lg:px-20'>
      <form onSubmit={handleSubmit} className='auth-form'>
        <h3>Reset password</h3>
        <div className='form-group'>
          <label htmlFor='password'>New Password</label>
          <input
            type='password'
            name='password'
            id='password'
            className='p-2 rounded-md border w-full'
            value={formInput.password}
            onChange={(e) =>
              setFormInput({ ...formInput, [e.target.name]: e.target.value })
            }
            placeholder='XXXXXXXXX'
            required
          />
        </div>

        <button className='btn'>Submit</button>
      </form>
    </article>
  );
};

export default ResetPassword;
