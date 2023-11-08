import { Route, Routes } from "react-router-dom";
import Signin from "./components/auth/Signin";
import Home from "./components/home/Home";
import EditProfile from "./components/user/EditProfile";
import Profile from "./components/user/Profile";
import Signup from "./components/user/Signup";
import Users from "./components/user/Users";
import PrivateRoute from "./components/auth/PrivateRoute";
import Menu from "./components/home/Menu";
import Forgot from "./components/user/Forgot";
import Reset from "./components/user/Reset";
import Activate from "./components/user/Activate";

const routes = [
  {
    path: "/",
    exact: true,
    Component: Home,
  },
  {
    path: "/users",
    Component: Users,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/signin",
    Component: Signin,
  },
  {
    path: "/user/edit/:userId",
    private: true,
    Component: EditProfile,
  },
  {
    path: "/user/:userId",
    Component: Profile,
  },
  {
    path: "/user/forgot-password",
    Component: Forgot,
  },
  {
    path: "/user/activate",
    Component: Activate,
  },
  {
    path: "/user/reset-password",
    Component: Reset,
  },
];

const AllRoutes = () => {
  return (
    <div>
      <Menu />
      <Routes>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              element={
                route.private ? (
                  <PrivateRoute Component={route.Component} />
                ) : (
                  <route.Component></route.Component>
                )
              }
            ></Route>
          );
        })}
      </Routes>
    </div>
  );
};

export default AllRoutes;
