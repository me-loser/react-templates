import React, { useState } from "react";
import { create } from "./api-user";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";

export default function Signup() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
        showNotification({
          type: "ERROR",
          message: data.error,
        });
      } else {
        showNotification({
          type: "SUCCESS",
          message: "Signed up successfully",
        });
        setValues({ ...values, error: "", open: true });
        navigate("/signin");
      }
    });
  };

  return (
    <div className={styles.card}>
      <h2>Sign Up</h2>
      <div className={styles.form}>
        <input
          placeholder="Name"
          type="text"
          onChange={handleChange("name")}
          value={values.name}
        />
        <input
          placeholder="Email"
          type="email"
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
        <Link to="/user/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
}
