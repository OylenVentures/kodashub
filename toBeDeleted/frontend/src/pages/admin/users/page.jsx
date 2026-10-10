import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getUser } from "../components/action";
import Loading from "../../../components/loading";
import { Link } from "react-router-dom";

function AdminUserPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleDeleteUser = async (email) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/users/${email}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.ok) {
        toast.success("Deleted Successfully");
        setData((prevData) => prevData.filter((user) => user.email !== email));
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
        const response = await getUser();
        if (response.ok) {
          const result = await response.json();
          setData(result.users);
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
      <h2 className='text-3xl font-bold text-purple-600 mb-4'>Users</h2>

      {data.length === 0 ? (
        <h5 className='text-center text-blue-600 mb-4'>No data to display</h5>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='py-2 px-4 border-b'>ID</th>
                <th className='py-2 px-4 border-b'>Email</th>
                <th className='py-2 px-4 border-b'>Phone</th>
                <th className='py-2 px-4 border-b'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data
                ?.filter((list) => list.role !== "ADMIN")
                ?.map((item) => (
                  <tr
                    key={item.id}
                    className='text-sm border-b hover:bg-gray-100'>
                    <td className='py-1 px-2'>{item.id.split("-")[0]}...</td>
                    <td className='py-1 px-2'>{item.email}</td>
                    <td className='py-1 px-2'>{item.phone_number}</td>
                    <td className='py-2 px-2'>
                      <div className='flex gap-2 text-2xl'>
                        <Link to={`/panel/users/${item.email}`}>
                          <FaEdit className='text-purple-500 hover:text-purple-700' />
                        </Link>
                        <FaTrash
                          className='text-red-500 hover:text-red-700 cursor-pointer'
                          onClick={() => handleDeleteUser(item.email)}
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

export default AdminUserPage;
