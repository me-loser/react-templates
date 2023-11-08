import React, { useState } from "react";
import styles from "./Forgot.module.css";
import { forgotPassword } from "./api-user";
import useNotification from "../hooks/useNotification";
const Forgot = () => {
  const [values, setValues] = useState({
    email: "",
    buttonText: "Get Email",
  });
  const { email, buttonText } = values;
  const { showNotification } = useNotification();

  const clickSubmit = async () => {
    if (!email.includes("@")) {
      showNotification({
        type: "ERROR",
        message: "Please write valid Email address",
      });
      return;
    }
    showNotification({
      type: "INFO",
      message: "Sending Email",
    });
    setValues({ ...values, buttonText: "Sending..." });
    forgotPassword(email).then((data) => {
      if (data.error) {
        setValues({ ...values, buttonText: "Get Email" });
        showNotification({
          type: "ERROR",
          message: data.error,
        });
      } else {
        setValues({ email: "", buttonText: "Email Sent" });
        showNotification({
          type: "SUCCESS",
          message: "Email Sent Successfully",
        });
        console.log(data);
      }
    });
  };
  return (
    <div className={styles["forgot-page"]}>
      <h1>Forgot Password</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        placeholder="Email"
      />
      <button
        onClick={clickSubmit}
        className={styles.btn}
        disabled={buttonText == "Email Sent"}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Forgot;
