import React from "react";
import unicornbikeImg from "./../assets/images/unicornbike.jpg";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Home Page</h1>
      <img src={unicornbikeImg} />
      <p className={styles.credits}>
        Photo by{" "}
        <a
          href="https://unsplash.com/@boudewijn_huysmans"
          target="_blank"
          rel="noopener noreferrer"
        >
          Boudewijn Huysmans
        </a>{" "}
        on Unsplash
      </p>
      <h4>Welcome to the MERN Skeleton home page.</h4>
    </div>
  );
};

export default Home;
