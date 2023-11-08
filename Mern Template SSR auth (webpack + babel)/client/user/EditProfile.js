import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { read, update } from "./api-user.js";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router";
import styles from "./Signup.module.css";
import { BsPersonCircle } from "react-icons/bs";
import { MdUpload } from "react-icons/md";

export default function EditProfile() {
  const { userId } = useParams();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    about: "",
    photo: "",
    open: false,
    error: "",
    redirectToProfile: false,
  });
  const jwt = auth.isAuthenticated();
  console.log(values.photo);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.password && userData.append("password", values.password);
    values.about && userData.append("about", values.about);
    values.photo && userData.append("photo", values.photo);

    update(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log(data);
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      }
    });
  };
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  if (values.redirectToProfile) {
    return <Navigate to={"/user/" + values.userId} />;
  }
  return (
    <div className={styles.card}>
      <h2 style={{ color: "red" }}>Edit Profile</h2>
      <BsPersonCircle fontSize={"3rem"} />
      <div className={styles.form}>
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          id="profile"
          onChange={handleChange("photo")}
        />
        <div className={styles["label-name"]}>
          <label htmlFor="profile" className={styles["file-input-label"]}>
            Upload <MdUpload size={30} />
          </label>
          <span className={styles.filename}>
            {values.photo ? values.photo.name : ""}
          </span>
        </div>
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
        <input
          type="text"
          placeholder="About"
          onChange={handleChange("about")}
          value={values.about}
        />
        <button className={styles["submit-button"]} onClick={clickSubmit}>
          SUBMIT
        </button>
      </div>
    </div>
  );
}
