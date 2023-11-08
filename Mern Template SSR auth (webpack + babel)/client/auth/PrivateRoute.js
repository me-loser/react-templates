import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import auth from "./auth-helper";

const PrivateRoute = ({ Component }) => {
  const location = useLocation();
  if (!auth.isAuthenticated()) {
    return <Navigate to={"/signin"} state={{ from: location.pathname }} />;
  }

  return <Component />;
};
export default PrivateRoute;
