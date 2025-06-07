// // export default userDetails;
// import React, { useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCurrentUser } from '../userProvider.jsx';
// import styles from './userDetails.module.css';

// // Some more details
// const UserDetails = () => {
//   const emailRef = useRef();
//   const phoneRef = useRef();
//   const alertDivRef = useRef();
//   const { currentUser, setCurrentUser } = useCurrentUser();
//   const navigate = useNavigate();
//   const [error, setError] = useState(null); // ייבוא נכון של useState

//   // Update the text in alert div.
//   const manageMassages = (message) => {
//     alertDivRef.current.innerText = message;
//   };

//   // Checks if the email address is valid.
//   const validateEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };


//   const writeUserToDB = async () => {
//     let newUser = {
//       username: currentUser.name,
//       email: emailRef.current.value,
//       password: currentUser.password,
//     };
//     try {
//       const response = await fetch('http://localhost:3000/users/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newUser),
//       });

//       if (!response.ok) throw new Error(`Error: ${response.status}`);

//       setCurrentUser({ ...currentUser, email: newUser.email });
//       localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, email: newUser.email }));
//       navigate('/home');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Check the details' validation.
//   const handleDetailsSubmit = (event) => {
//     event.preventDefault();
//     if (!validateEmail(emailRef.current.value)) {
//       manageMassages("email not valid!");
//       emailRef.current.value = '';
//     } else
//       writeUserToDB();

//   };

//   return (
//     <>
//       <h3 className={styles.title}>More Details</h3>
//       <div className={styles.steps}><strong>2</strong> / 2 STEPS</div>
//       <form className={styles.form} onSubmit={handleDetailsSubmit}>
//         <input
//           className={styles.input}
//           ref={emailRef}
//           type="email"
//           placeholder="email"
//           required
//         />

//         <div className={styles.alert} ref={alertDivRef}></div>
//         <button className={styles.button} type="submit">
//           submit
//         </button>
//       </form>
//       {error && <p>{error}</p>} 
//     </>
//   );
// };

// export default UserDetails;
