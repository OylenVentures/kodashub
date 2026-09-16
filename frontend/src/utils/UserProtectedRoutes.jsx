import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoutes = () => {
  const authenticated = sessionStorage.getItem("token");

  return authenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default UserProtectedRoutes;
