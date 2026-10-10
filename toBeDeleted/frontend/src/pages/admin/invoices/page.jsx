import { useState, useEffect } from "react";
import { FaEdit, FaPlusSquare, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getInvoice } from "../components/action";
import Loading from "../../../components/loading";
import { Link } from "react-router-dom";

function AdminInvoicePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleDeleteInvoice = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/invoice/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.ok) {
        toast.success("Deleted Successfully");
        setData((prevData) => prevData.filter((item) => item.id !== id));
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
        const response = await getInvoice();
        if (response.ok) {
          const result = await response.json();
          setData(result.invoice);
        } else {
          setError(response.statusText);
        }
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
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold text-purple-600 mb-4'>Invoices</h2>
        <Link to='/panel/invoices/new'>
          <FaPlusSquare className='text-blue-500 hover:text-blue-700 text-2xl' />
        </Link>
      </div>

      {data.length === 0 ? (
        <h5 className='text-center text-blue-600 mb-4'>No data to display</h5>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='py-2 px-4 border-b'>ID</th>
                <th className='py-2 px-4 border-b'>Details</th>
                <th className='py-2 px-4 border-b'>Status</th>
                <th className='py-2 px-4 border-b'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr
                  key={item.id}
                  className='text-sm border-b hover:bg-gray-100'>
                  <td className='py-1 px-2'>{item.id.split("-")[0]}...</td>
                  <td className='py-1 px-2'>
                    {item.name} (₦{item.price})
                  </td>
                  <td
                    className={`py-1 px-2 ${
                      item.status ? "text-lime-500" : "text-red-500"
                    }`}>
                    {item.status ? "Paid" : "Unpaid"}
                  </td>
                  <td className='py-2 px-2'>
                    <div className='flex gap-2 text-2xl'>
                      <Link to={`/panel/invoices/${item.id}`}>
                        <FaEdit className='text-purple-500 hover:text-purple-700' />
                      </Link>
                      <FaTrash
                        className='text-red-500 hover:text-red-700 cursor-pointer'
                        onClick={() => handleDeleteInvoice(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminInvoicePage;
