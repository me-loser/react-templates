import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Forgot.module.css";
import { forgotPassword } from "../user/api-auth";
const Forgot = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const clickSubmit = async () => {
    if (!value.includes("@")) return;
    const email = value;
    forgotPassword(email).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
      }
    });
  };
  return (
    <div className={styles["forgot-page"]}>
      <h1>Forgot Password</h1>
      <input
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Email"
      />
      <button onClick={clickSubmit} className={styles.btn}>
        Get Email
      </button>
    </div>
  );
};

export default Forgot;
