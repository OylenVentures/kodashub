import { Outlet, ScrollRestoration } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const GeneralSharedLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <ScrollRestoration
        getKey={(location, matches) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default GeneralSharedLayout;
