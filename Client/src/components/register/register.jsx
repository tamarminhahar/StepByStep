import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './register.module.css';

// Sign Up Form
export default function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordVerRef = useRef();
    const roleRef = useRef();
    const alertDivRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Function to display message in the alert div
    const manageMessages = (message) => {
        alertDivRef.current.innerText = message;
    };

    // Function to check if the username already exists
    const checkUserExists = async (user_name) => {
        try {
            const response = await fetch(`http://localhost:3000/users/${user_name}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    if (response.status === 404) {
      return false; 
    }

    if (response.status === 409) {
      return true;
    }
            if (!response.ok) {
                throw new Error('Failed to check user existence');
            }

            return true; // User exists
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    // Function to verify that password and verify password match
    const verifyPassword = () => {
        return passwordRef.current.value === passwordVerRef.current.value;
    };

    // Submit handler for the register form
    const handleRegisterSubmit = (event) => {
        event.preventDefault();

        checkUserExists(nameRef.current.value).then((exists) => {
            if (exists) {
                manageMessages('User already exists');
            } else {
                if (verifyPassword()) {
                    let newUser = {
                        name: nameRef.current.value,
                        email: emailRef.current.value,
                        password: passwordVerRef.current.value,
                        role: roleRef.current.value.toLowerCase(),

                    };
                      
            const path =
                        roleRef.current.value === 'bereaved'
                            ? '/bereavedDetails'
                            : '/supporterDetails';

                    navigate(path, { state: { newUser} });
            } else {
                manageMessages('You have to use the same password. Please recheck!');
                passwordVerRef.current.value = '';
            }
        }
        });
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <h3 className={styles.title}>New Account</h3>
            <div className={styles.steps}><strong>1</strong> / 2 STEPS</div>
            <form className={styles.container} onSubmit={handleRegisterSubmit}>
                <input className={styles.input} ref={nameRef} type="text" placeholder="name" required />
                <input className={styles.input} ref={emailRef} type="email" placeholder="email" required />
                <input className={styles.input} ref={passwordRef} type="password" placeholder="password" required />
                <input className={styles.input} ref={passwordVerRef} type="password" placeholder="verify password" required />
                <select className={styles.input} ref={roleRef} required>
                    <option value="bereaved">Bereaved</option>
                    <option value="supporter">Supporter</option>
                    <option value="admin">Admin</option>
                </select>
                <div className={styles.alert} ref={alertDivRef}></div>
                <button className={styles.button} type="submit">submit</button>
                <div className={styles.linkContainer}>Already have an account?</div>
                <Link className={styles.link} to="/login">Login</Link>
            </form>
        </>
    );
}