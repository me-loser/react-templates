import React, { useEffect, useState } from "react";
import styles from "./Forgot.module.css";
import { useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import useQuery from "../hooks/useQuery";
import { resetPassword } from "./api-user";
const Reset = () => {
  const query = useQuery();
  const { showNotification } = useNotification();
  const token = query.get("token");
  const navigate = useNavigate();
  const [values, setValues] = useState({
    newPassword: "",
    buttonText: "Reset Password",
  });
  const { newPassword, buttonText } = values;

  const handleChange = (event) => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = async () => {
    setValues({ ...values, buttonText: "Submitting" });
    const data = { newPassword, resetPasswordLink: token };
    resetPassword(data).then((res) => {
      if (res.error) {
        showNotification({
          type: "ERROR",
          message: res.error,
        });
        console.log(res.error);
        setValues({ ...values, buttonText: "Reset Password" });
      } else {
        console.log(res);
        showNotification({
          type: "SUCCESS",
          message: "Password Reset Successfylly",
        });
        navigate("/signin");
        setValues({ ...values, buttonText: "Done" });
      }
    });
  };

  return (
    <div className={styles["forgot-page"]}>
      <h1>Reset Password</h1>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => {
          handleChange(e);
        }}
        placeholder="New Password"
      />
      <button onClick={clickSubmit} className={styles.btn}>
        {buttonText}
      </button>
    </div>
  );
};

export default Reset;
