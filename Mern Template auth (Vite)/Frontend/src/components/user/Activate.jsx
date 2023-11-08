import React from "react";
import { activate } from "./api-user";
import { useNavigate } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import styles from "./Signup.module.css";
import useNotification from "../hooks/useNotification";

const Activate = () => {
  const query = useQuery();
  const token = query.get("token");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const clickSubmit = async () => {
    activate({ token: token }).then((data) => {
      if (data.error) {
        showNotification({
          type: "ERROR",
          message: data.error,
        });
        if (data.error == "Link Expired. Please Singup again.") {
          navigate("/signup");
        }
        console.log(data.error);
      } else {
        showNotification({
          type: "SUCCESS",
          message: "You have successfully signed up",
        });
        navigate("/signin");
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
