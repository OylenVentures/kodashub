import { Skeleton } from "../../../components/Skeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const MyInvoices = () => {
  const [data, setData] = useState();

  const handlePayment = async (id, email, price) => {
    const payment = { id, email, price };
    try {
      await fetch(`${import.meta.env.VITE_API_URI}/api/checkout`, {
        method: "POST",
        body: JSON.stringify(payment),
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((result) => (window.location.href = result?.path || "/dashboard"))
        .catch((err) => toast.error(err));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const user = sessionStorage?.getItem("user");
    fetch(`${import.meta.env.VITE_API_URI}/api/invoice/${user}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    })
      .then((resp) => resp.json())
      .then((result) => setData(result.userInvoice))
      .catch((error) => toast.error(error));
  }, []);

  if (!data) {
    return <Skeleton />;
  }

  return (
    <div className='text-center p-5 bg-white rounded-md'>
      <h3>My Invoices</h3>

      {data?.length <= 0 && <p className='text-blue-500'>No invoice found</p>}

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
                  {item.status == false ? "Unpaid" : "Paid"}
                </td>
                <td className='py-1 px-2 border-b'>
                  <button
                    className='px-4 py-2 rounded-lg w-fit h-fit font-semibold duration-150 text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700'
                    onClick={() =>
                      handlePayment(
                        item.id,
                        sessionStorage?.getItem("user"),
                        item.price
                      )
                    }>
                    Pay now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
