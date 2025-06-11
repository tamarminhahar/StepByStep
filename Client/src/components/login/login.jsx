
import React, { useRef, useState } from 'react';
import styles from './login.module.css';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const nameRef = useRef();
    const passwordRef = useRef();
    const alertDivRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const manageMessages = (message) => {
        if (alertDivRef.current) {
            alertDivRef.current.innerText = message;
        }
    };

    const loginUser = async (username, password) => {
        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: username,
                    password: password,
                }),
                credentials: 'include', 
            });

            if (!response.ok) {
                return { ok: false };
            }

            const data = await response.json();
            return { ok: true, user: data.user }; 
        } catch (error) {
            console.error(error);
            return { ok: false };
        }
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        loginUser(nameRef.current.value, passwordRef.current.value).then((result) => {
            if (!result.ok) {
                manageMessages('Username or password incorrect, try again');
            } else {
        window.location.href = '/home';
            }
        });
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.loginForm}>
            <div id="container" className={styles.container}>
                <h3 className={styles.title}>Login</h3>
                <form onSubmit={handleLoginSubmit} className={styles.form}>
                    <input ref={nameRef} type="text" placeholder="name" required className={styles.input} />
                    <input ref={passwordRef} type="password" placeholder="password" required className={styles.input} />
                    <div ref={alertDivRef} className={styles.alert}></div>
                    <button type="submit" className={styles.button}>submit</button>
                    <div className={styles.linkContainer}>
                        <span>First time? </span>
                        <Link to="/register" className={styles.link}>Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
