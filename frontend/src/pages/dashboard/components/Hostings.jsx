import { Skeleton } from "../../../components/Skeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const Hostings = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    fetch(`${import.meta.env.VITE_API_URI}/api/hosting/${user}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    })
      .then((resp) => resp.json())
      .then((result) => setData(result.userHosting))
      .catch((error) => toast.error(error));
  }, []);

  if (!data) {
    return <Skeleton />;
  }

  return (
    <div className='text-center p-5 bg-white rounded-md'>
      <h3>My Hosting Services</h3>

      {data?.length <= 0 && (
        <p className='text-blue-500'>No hosting service found</p>
      )}

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='py-2 px-4 border-b'>ID</th>
              <th className='py-2 px-4 border-b'>Details</th>
              <th className='py-2 px-4 border-b'>Status</th>
              <th className='py-2 px-4 border-b'>Expiration</th>
              <th className='py-2 px-4 border-b'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id} className='text-sm hover:bg-gray-100'>
                <td className='py-1 px-2 border-b'>
                  {item.id.split("-")[0]}...
                </td>
                <td className='py-1 px-2 border-b'>
                  {item.name} (₦{item.price})
                </td>
                <td
                  className={`py-1 px-2 border-b ${
                    item.status ? "text-lime-500" : "text-red-500"
                  }`}>
                  {item.status ? "Active" : "Inactive"}
                </td>
                <td className='py-1 px-2 border-b'>{item.expiration}</td>
                <td className='py-1 px-2 border-b'>
                  {item.url !== " " && (
                    <Link
                      href={item.url || "/"}
                      className='block px-3 py-3 mb-2 rounded-lg w-full font-semibold text-sm duration-150 text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700'>
                      cPanel
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
