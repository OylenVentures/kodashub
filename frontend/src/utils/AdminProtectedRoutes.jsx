import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const authenticated = localStorage.getItem("token");

  return authenticated ? <Outlet /> : <Navigate to='/admin' />;
};

export default AdminProtectedRoutes;
