import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./auth/Signin";
import Home from "./core/Home";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import Signup from "./user/Signup";
import Users from "./user/Users";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";
import Activate from "./user/Activate";
import Reset from "./auth/Reset";
import Forgot from "./auth/Forgot";

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
    path: "/user/activate/:token",
    Component: Activate,
  },
  {
    path: "/auth/password/forgot",
    Component: Forgot,
  },
  {
    path: "/auth/password/reset/:token",
    Component: Reset,
  },
];

const MainRouter = () => {
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

export default MainRouter;
