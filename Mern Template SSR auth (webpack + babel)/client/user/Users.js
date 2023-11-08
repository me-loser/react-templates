import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { list } from "./api-user.js";
import styles from "./Users.module.css";
import { FaUserAlt } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div className={styles.users}>
      <h1>All Users</h1>
      <ul className={styles.list}>
        {users.map((user, i) => (
          <Link className={styles.link} to={`/user/${user._id}`} key={i}>
            <li className={styles["list-item"]}>
              <div className={styles.avatar}>
                <FaUserAlt />
              </div>{" "}
              <p>{user.name}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
