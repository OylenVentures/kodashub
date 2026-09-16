import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateDomain() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    plan: "",
    price: "",
    status: Boolean,
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    navigate("/panel/domains");
    try {
    } catch (error) {}
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/api/domains/${id}`)
      .then((resp) => resp.json())
      .then((result) =>
        setData({
          plan: result?.data.plan,
          price: result?.data.price,
          status: result?.data.status,
        })
      )
      .catch((err) => toast.error(err));
  }, [header]);

  return (
    <section className='p-5 bg-white rounded shadow-md'>
      <div className='flex-1'>
        <h2 className='text-3xl font-bold text-purple-600 mb-4'>
          Update a Domain
        </h2>

        <form onSubmit={handleSave}>
          <label className='block mb-2'>
            <span className='text-gray-700'>Plan</span>
            <input
              type='text'
              name='plan'
              value={data.plan}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>price</span>
            <input
              type='text'
              name='price'
              value={data.price}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Status</span>
            <input
              type='text'
              name='status'
              value={data.status}
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
              to='/panel/domains'
              className='bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded'>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
