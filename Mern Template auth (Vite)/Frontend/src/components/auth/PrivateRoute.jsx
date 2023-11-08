import React from "react";
import { Navigate } from "react-router-dom";
import auth from "./auth-helper";

const PrivateRoute = ({ Component }) => {
  if (!auth.isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return <Component />;
};
export default PrivateRoute;
