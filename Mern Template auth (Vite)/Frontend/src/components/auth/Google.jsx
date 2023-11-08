import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleSignin } from "../user/api-auth";
import styles from "../user/Signup.module.css";

const Google = ({ informParent }) => {
  const successHandler = async (codeResponse) => {
    googleSignin({
      code: codeResponse.code,
    }).then((res) => {
      informParent(res);
    });
  };
  const loginWithGoogle = useGoogleLogin({
    onSuccess: successHandler,
    flow: "auth-code",
  });

  return (
    <div>
      <button className={styles["submit-button"]} onClick={loginWithGoogle}>
        Login With Google
      </button>
    </div>
  );
};

export default Google;
