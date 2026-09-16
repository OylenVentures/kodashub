import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaGlobe,
  FaInternetExplorer,
  FaMoneyBillWave,
  FaServer,
} from "react-icons/fa";
import { getHosting, getInvoice, getWebsite } from "../../components/action";

export default function Datapool() {
  const [hostings, setHostings] = useState(0);
  const [websites, setWebsites] = useState(0);
  const [invoices, setInvoices] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hostingResponse, websiteResponse, invoiceResponse] =
          await Promise.all([getHosting(), getWebsite(), getInvoice()]);
        if (hostingResponse.ok) {
          const result = await hostingResponse.json();
          setHostings(result?.userHosting.length || 0);
        } else {
          console.error(
            "Error fetching hostings:",
            hostingResponse?.statusText
          );
        }
        if (websiteResponse.ok) {
          const result = await websiteResponse.json();
          setWebsites(result?.userWebsite.length || 0);
        } else {
          console.error(
            "Error fetching websites:",
            websiteResponse?.statusText
          );
        }
        if (invoiceResponse.ok) {
          const result = await invoiceResponse.json();
          setInvoices(result?.userInvoice.length || 0);
        } else {
          console.error(
            "Error fetching invoices:",
            invoiceResponse?.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 500);
  }, []);

  return (
    <section className='p-5 bg-white rounded shadow-md'>
      <h2 className='text-3xl font-bold text-purple-600 mb-4'>Dashboard</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
        <div className='bg-blue-100 p-4 rounded shadow-md flex items-center gap-5 justify-center'>
          <div>
            <h3 className='text-lg font-bold text-blue-600 mb-2'>Hostings</h3>
            <p className='text-3xl font-bold text-gray-700'>{hostings}</p>
            <Link
              to='/dashboard/hosting'
              className='text-sm text-blue-600 hover:text-blue-700'>
              View All Hostings
            </Link>
          </div>
          <FaServer className='w-20 h-20' />
        </div>

        {/* <div className='bg-green-100 p-4 rounded shadow-md flex items-center gap-5 justify-center'>
          <div>
            <h3 className='text-lg font-bold text-green-600 mb-2'>Domains</h3>
            <p className='text-3xl font-bold text-gray-700'>{domains}</p>
            <Link
              to='/dashboard/domains'
              className='text-sm text-green-600 hover:text-green-700'>
              View All Domains
            </Link>
          </div>
          <FaGlobe className='w-20 h-20' />
        </div> */}

        <div className='bg-orange-100 p-4 rounded shadow-md flex items-center gap-5 justify-center'>
          <div>
            <h3 className='text-lg font-bold text-orange-600 mb-2'>Websites</h3>
            <p className='text-3xl font-bold text-gray-700'>{websites}</p>
            <Link
              to='/dashboard/website'
              className='text-sm text-orange-600 hover:text-orange-700'>
              View All Website
            </Link>
          </div>
          <FaInternetExplorer className='w-20 h-20' />
        </div>

        <div className='bg-yellow-100 p-4 rounded shadow-md flex items-center gap-5 justify-center'>
          <div>
            <h3 className='text-lg font-bold text-orange-600 mb-2'>Invoices</h3>
            <p className='text-3xl font-bold text-gray-700'>{invoices}</p>
            <Link
              to='/dashboard/invoice'
              className='text-sm text-orange-600 hover:text-orange-700'>
              View All Invoices
            </Link>
          </div>
          <FaMoneyBillWave className='w-20 h-20' />
        </div>
      </div>
    </section>
  );
}
