import Loading from "../../../components/loading";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function AdminServicePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleDeleteService = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/service/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.ok) {
        toast.success("Deleted Successfully");
        setData((prevData) => prevData.filter((service) => service.id !== id));
      } else {
        toast.error(response.statusText);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URI}/api/service`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        setData(result.service);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <h5 className='text-center text-red-600 mb-4'>Error: {error}</h5>;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <section className='p-3 bg-white rounded shadow-md'>
      <h2 className='text-3xl font-bold text-purple-600 mb-4'>Services</h2>

      {data.length === 0 ? (
        <h5 className='text-center text-blue-600 mb-4'>No data to display</h5>
      ) : (
        <ul className='relative grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {data.map((service) => (
            <li className='rounded-md bg-purple-100' key={service.id}>
              <div className='flex text-center justify-center p-4'>
                <div className='space-y-2'>
                  {service.category}
                  <h4 className='text-gray-800 font-semibold'>
                    {service.plan}
                  </h4>
                  <p className='text-gray-600 text-sm'>₦{service.amount}</p>
                </div>
              </div>
              <div className='flex gap-2 text-2xl py-2 px-4 border-t-2 text-right'>
                <Link to={`/panel/services/${service.id}`}>
                  <FaEdit className='text-purple-500 hover:text-purple-700' />
                </Link>
                <FaTrash
                  className='text-red-500 hover:text-red-700 cursor-pointer'
                  onClick={() => handleDeleteService(service.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AdminServicePage;
