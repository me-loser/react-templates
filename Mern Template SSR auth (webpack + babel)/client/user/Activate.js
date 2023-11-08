import React from "react";
import { useParams } from "react-router";
import { activate } from "./api-user";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

const Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const clickSubmit = async () => {
    activate({ token: token }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        navigate("/singin");
      }
    });
  };
  return (
    <div className={styles["activate-page"]}>
      <h1>Hey, Click the below button to Activate your Account.</h1>
      <button onClick={clickSubmit}>Activate Account</button>
    </div>
  );
};

export default Activate;
