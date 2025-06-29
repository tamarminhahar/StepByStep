
import React from "react";
import Nav from "../nav/Nav";
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useNavigate } from "react-router-dom";
import styles from './homeStyle/Home.module.css';

export default function Home() {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      <Nav />

      <div className={styles.homeContainer}>
        <h1 className={styles.title}>ברוך/ה הבא/ה {currentUser?.user_name} </h1>
        <p className={styles.description}>
          כאן זה המקום לשתף, להרגיש, לתמוך ולהיתמך.  
          יחד אנחנו יוצרים קהילה אמיצה ומחבקת, שמבינה אותך.
        </p>

      </div>
    </div>
  );
}