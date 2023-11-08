import React, { useState } from "react";
import auth from "./../auth/auth-helper";
import { remove } from "./api-user";
import { Navigate } from "react-router-dom";
import styles from "./DeleteUser.module.css";
import { AiFillDelete } from "react-icons/ai";

export default function DeleteUser({ userId }) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };
  const deleteAccount = () => {
    remove(
      {
        userId: userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT(() => console.log("deleted"));
        setRedirect(true);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };
  const backdropClose = (e) => {
    if (e.target.id == "backdrop") {
      console.log("running");
      handleRequestClose();
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <button className={styles["open-button"]} onClick={clickButton}>
        <AiFillDelete className={styles["delete-icon"]} />
      </button>
      {open && (
        <div
          id="backdrop"
          className={styles.backdrop}
          onClick={(e) => backdropClose(e)}
        >
          <div className={styles.modal}>
            <h1>Delete Account</h1>
            <p>Confirm to delete your account</p>
            <div className={styles["actions"]}>
              <button
                className={styles["delete-button"]}
                onClick={handleRequestClose}
              >
                CANCEL
              </button>
              <button
                className={styles["delete-button"]}
                onClick={deleteAccount}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
