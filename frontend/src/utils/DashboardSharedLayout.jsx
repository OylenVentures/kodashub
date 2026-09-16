import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Sidebar } from "../pages/dashboard/components/Sidebar";
import { Header } from "../pages/dashboard/components/Header";

const GeneralSharedLayout = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <Sidebar toggle={toggle} handleToggle={() => setToggle(!toggle)} />
      <div>
        <Header toggle={toggle} handleToggle={() => setToggle(!toggle)} />
        <div className='bg-slate-400 p-5 overflow-y-scroll h-[80vh]'>
          <Outlet />
        </div>
      </div>
      <ScrollRestoration
        getKey={(location, matches) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default GeneralSharedLayout;
