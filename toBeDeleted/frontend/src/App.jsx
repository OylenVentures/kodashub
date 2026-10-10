import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProtectedRoutes from "./utils/UserProtectedRoutes";
import AdminProtectedRoutes from "./utils/AdminProtectedRoutes";
import GeneralLayout from "./utils/GeneralSharedLayout";
import AuthLayout from "./utils/AuthSharedLayout";
import DashboardLayout from "./utils/DashboardSharedLayout";
import AdminLayout from "./utils/AdminSharedLayout";
import Loader from "./components/loading";

// general routes
const Home = lazy(() => import("./pages/general/home/page"));
const Services = lazy(() => import("./pages/general/services/page"));
const Contact = lazy(() => import("./pages/general/contact/page"));
const Login = lazy(() => import("./pages/auth/login/page"));
const Register = lazy(() => import("./pages/auth/register/page"));
// dashboard routes
const Dashboard = lazy(() => import("./pages/dashboard/home/page"));
const NewServices = lazy(() => import("./pages/dashboard/services/page"));
const Hosting = lazy(() => import("./pages/dashboard/hosting/page"));
const Invoice = lazy(() => import("./pages/dashboard/invoice/page"));
const Website = lazy(() => import("./pages/dashboard/website/page"));
const Profile = lazy(() => import("./pages/dashboard/profile/page"));
// pasword reset
const ResetPassword = lazy(() => import("./pages/resetpassword/page"));
const UpdatePassword = lazy(() =>
  import("./pages/resetpassword/updatepassword/page")
);
// admin routes
const Admin = lazy(() => import("./pages/admin/page"));
const Panel = lazy(() => import("./pages/admin/home/page"));
const Service = lazy(() => import("./pages/admin/services/page"));
const ServiceUpdate = lazy(() => import("./pages/admin/services/update/page"));
const Users = lazy(() => import("./pages/admin/users/page"));
const UserUpdate = lazy(() => import("./pages/admin/users/update/page"));
const Hostings = lazy(() => import("./pages/admin/hostings/page"));
const UpdateHosting = lazy(() => import("./pages/admin/hostings/update/page"));
const CreateHosting = lazy(() => import("./pages/admin/hostings/new/page"));
const Websites = lazy(() => import("./pages/admin/websites/page"));
const UpdateWebsite = lazy(() => import("./pages/admin/websites/update/page"));
const CreateWebsite = lazy(() => import("./pages/admin/websites/new/page"));
const Invoices = lazy(() => import("./pages/admin/invoices/page"));
const UpdateInvoice = lazy(() => import("./pages/admin/invoices/update/page"));
const CreateInvoice = lazy(() => import("./pages/admin/invoices/new/page"));

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/' element={<GeneralLayout />}>
          <Route index element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/resetpassword/:token' element={<UpdatePassword />} />
        </Route>
        <Route element={<UserProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/dashboard/services' element={<NewServices />} />
            <Route path='/dashboard/hosting' element={<Hosting />} />
            <Route path='/dashboard/invoice' element={<Invoice />} />
            <Route path='/dashboard/website' element={<Website />} />
            <Route path='/dashboard/profile' element={<Profile />} />
          </Route>
        </Route>
        <Route element={<AdminProtectedRoutes />}>
          <Route path='/panel' element={<AdminLayout />}>
            <Route index element={<Panel />} />
            <Route path='/panel/services' element={<Service />} />
            <Route path='/panel/services/:id' element={<ServiceUpdate />} />
            <Route path='/panel/users' element={<Users />} />
            <Route path='/panel/users/:email' element={<UserUpdate />} />
            <Route path='/panel/hostings' element={<Hostings />} />
            <Route path='/panel/hostings/:id' element={<UpdateHosting />} />
            <Route path='/panel/hostings/new' element={<CreateHosting />} />
            <Route path='/panel/websites' element={<Websites />} />
            <Route path='/panel/websites/:id' element={<UpdateWebsite />} />
            <Route path='/panel/websites/new' element={<CreateWebsite />} />
            <Route path='/panel/invoices' element={<Invoices />} />
            <Route path='/panel/invoices/:id' element={<UpdateInvoice />} />
            <Route path='/panel/invoices/new' element={<CreateInvoice />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  );
}

export default App;
