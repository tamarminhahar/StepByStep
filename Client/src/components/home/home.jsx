import React, { useState } from "react";
import Nav from "../nav/Nav";
import { useCurrentUser } from "../hooks/useCurrentUser"; // ודא נתיב נכון
import NotificationPanel from "../notification/NotificationPanel";import ChatWindow from '../chat/ChatWindow'; // ודא נתיב
import styles from './Home.module.css'; // ייבוא מודול CSS

export default function Home() {
  const { currentUser } = useCurrentUser();

  const dummyOtherUserId = 2;
  const mode = currentUser?.role === 'supporter' ? 'bereaved' : 'supporter';

  return (
<div className="pageWrapper">
      <Nav />
      {/* <h1>ברוך הבא { currentUser.user_name }</h1> */}
      <NotificationPanel/>

</div>
  );
}
