import { useState } from "react";
import { toast } from "react-toastify";
import support from "../../../../assets/va.png";

export default function CreateService() {
  const [data, setData] = useState({
    plan: "",
    description: "",
    amount: 50,
    features: "",
    category: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URI}/api/service`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((resp) => {
          if (resp.ok) {
            toast.success("Service created successfully");
            setData({
              plan: "",
              description: "",
              amount: 50,
              features: "",
              category: "",
            });
          }
        })
        .catch((err) => toast.error(err));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className='p-5 bg-white rounded shadow-md flex gap-5 justify-center'>
      <div className='flex-1'>
        <h2 className='text-3xl font-bold text-purple-600 mb-4'>
          Create a new service
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
              placeholder='Enter plan'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Description</span>
            <input
              type='text'
              name='description'
              value={data.description}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
              placeholder='Enter description'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Amount</span>
            <input
              type='number'
              name='amount'
              value={data.amount}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
              placeholder='Enter amount'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Features</span>
            <input
              type='text'
              name='features'
              value={data.features}
              onChange={handleChange}
              className='w-full p-2 pl-10 text-sm text-gray-700 border border-gray-400 rounded-md outline-none'
              placeholder='"Free domain", "Free SSL",...'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-gray-700'>Category</span>
            <select
              name='category'
              id='category'
              className='w-full p-2 pl-10 text-sm border border-gray-400 rounded-md'
              onChange={handleChange}>
              <option value='UNCATEGORIZED'>Uncategorized</option>
              <option value='DOMAIN'>Domain</option>
              <option value='HOSTING'>Hosting</option>
              <option value='DEVELOPMENT'>Development</option>
            </select>
          </label>
          <button
            type='submit'
            className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
            Save
          </button>
        </form>
      </div>

      <div className='hidden md:block flex-1'>
        <img src={support} className='object-fill w-full h-full' alt='banner' />
      </div>
    </section>
  );
}
