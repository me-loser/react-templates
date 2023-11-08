import React, { useState, useEffect } from "react";
import DeleteUser from "./DeleteUser";
import auth from "./../auth/auth-helper";
import { read } from "./api-user.js";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router";
import { FaUserAlt } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import styles from "./Profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

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
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  if (redirectToSignin) {
    navigate("/signin", { state: { from: `/user/${userId}` } });
  }
  return (
    <div className={styles.profile}>
      <h2>Profile</h2>
      <div className={styles["profile-details"]}>
        <div className={styles.avatar}>
          <FaUserAlt />
        </div>
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
        {auth.isAuthenticated().user &&
          auth.isAuthenticated().user._id == user._id && (
            <div className={styles["profile-actions"]}>
              <Link to={`/user/edit/${user._id}`}>
                <AiFillEdit className={styles.edit} />
              </Link>
              <DeleteUser userId={userId} />
            </div>
          )}
      </div>
      <p>About: {user.about}</p>
      <p>
        Joined: <span>{new Date(user.created).toDateString()}</span>
      </p>
    </div>
  );
}
