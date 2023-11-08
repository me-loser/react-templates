import React from "react";
import MainRouter from "./MainRouter";
// import NotificationProvider from "./contexts/NotificationProvider";
import { BrowserRouter } from "react-router-dom";
import { hot } from "react-hot-loader";
import "./app.css";

const App = () => {
  // React.useEffect((props) => {
  //   const jssStyles = document.querySelector("#jss-server-side");
  //   if (jssStyles) {
  //     jssStyles.parentNode.removeChild(jssStyles);
  //   }
  // }, []);
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  );
};

export default hot(module)(App);
