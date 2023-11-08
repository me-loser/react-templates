import React, { useState } from "react";
import auth from "./auth-helper";
import { Navigate } from "react-router-dom";
import { signin } from "../user/api-auth.js";
import { useLocation } from "react-router-dom";
import styles from "../user/Signup.module.css";

export default function Signin() {
  const location = useLocation();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "", redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { from } = location.state || {
    from: {
      pathname: "/",
    },
  };
  const { redirectToReferrer } = values;
  if (redirectToReferrer) {
    return <Navigate to={from} />;
  }

  return (
    <div className={styles.card}>
      <h2>Sign In</h2>
      <div className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          onChange={handleChange("email")}
          value={values.email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={handleChange("password")}
          value={values.password}
        />
        <button className={styles["submit-button"]} onClick={clickSubmit}>
          SUBMIT
        </button>
      </div>
    </div>
  );
}
