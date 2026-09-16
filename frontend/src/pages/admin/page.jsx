import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URI}/api/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      });

      if (!resp.ok) {
        toast.error("Invalid details!");
      }

      const user = await resp.json();
      const decode = jwtDecode(user.token);

      if (decode.role !== import.meta.env.VITE_SSP) {
        toast.error("You are not authorized");
      } else {
        localStorage.setItem("token", user.token);
        navigate("/panel");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <article className='h-screen flex justify-center items-center bg-purple-100'>
      <div className='max-w-md w-full p-4 bg-white rounded shadow-md'>
        <h2 className='text-3xl font-bold text-purple-600 mb-4'>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <label className='block mb-2'>
            <span className='text-gray-700'>Email</span>
            <input
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className='w-full p-2 pl-10 text-sm text-gray-700'
              placeholder='Enter email'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Password</span>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='w-full p-2 pl-10 text-sm text-gray-700'
              placeholder='Enter password'
            />
          </label>
          <button
            type='submit'
            className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
            Login
          </button>
        </form>
      </div>
    </article>
  );
}

export default AdminLoginPage;
