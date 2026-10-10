import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateUser() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      fetch(`${import.meta.env.VITE_API_URI}/api/users/${email}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((resp) => {
          if (resp.ok) {
            navigate("/panel/users");
          } else {
            toast.error(resp.statusText);
          }
        })
        .catch((err) => toast.error(err));
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/api/users/${email}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((resp) => resp.json())
      .then((result) =>
        setData({
          first_name: result.existingUser.first_name,
          last_name: result?.existingUser.last_name,
          email: result?.existingUser.email,
          phone_number: result?.existingUser.phone_number,
        })
      )
      .catch((err) => toast.error(err));
  }, [email]);

  return (
    <section className='p-5 bg-white rounded shadow-md'>
      <div className='flex-1'>
        <h2 className='text-3xl font-bold text-purple-600 mb-4'>
          Update a user
        </h2>

        <form onSubmit={handleSave}>
          <label className='block mb-2'>
            <span className='text-gray-700'>First name</span>
            <input
              type='text'
              name='first_name'
              value={data.first_name}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Last name</span>
            <input
              type='text'
              name='last_name'
              value={data.last_name}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Email</span>
            <input
              type='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Phone number</span>
            <input
              type='tel'
              name='phone_number'
              value={data.phone_number}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
            />
          </label>

          <div className='flex gap-5 items-center'>
            <button
              type='submit'
              className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
              Save
            </button>

            <Link
              to='/panel/users'
              className='bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded'>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
