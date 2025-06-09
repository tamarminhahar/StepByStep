import React, { useRef, useState } from 'react';
import { useNavigate ,useLocation } from 'react-router-dom';
import styles from './userDetails.module.css'; // You can reuse the same CSS

// Supporter Profile Form
const SupporterDetails = () => {
    const supporterTypeRef = useRef();
    const alertDivRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
        const location = useLocation();


    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');
    

    // Function to display message in the alert div
    const manageMessages = (message) => {
        alertDivRef.current.innerText = message;
    };

    // Function to send the supporter profile to server
    const writeProfileToDB = async () => {
        const body = {
            user_id: currentUser.id,
            Supporter: supporterTypeRef.current.value,
        };

        try {
            const userResponse  = await fetch('http://localhost:3000/', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Bearer ${token}`, // Send JWT token
                // },
                // body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!userResponse.ok) throw new Error(`Error: ${userResponse.status}`);
            const { id } = await userResponse.json();

            const body = {
                user_id: id,
                Supporter: supporterTypeRef.current.value,
            };

            const profileResponse = await fetch('http://localhost:3000/supporter_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);
            if (!profileResponse.ok) throw new Error(`Error: ${profileResponse.status}`);
            // });

            // if (!response.ok) throw new Error(`Error: ${response.status}`);

            // Navigate to home page after success
            navigate('/home');
        } catch (err) {
            setError(err.message);
        }
    };

    // Submit handler for the profile form
    const handleDetailsSubmit = (event) => {
        event.preventDefault();
        writeProfileToDB();
    };

    return (
        <>
            <h3 className={styles.title}>Supporter Profile</h3>
            <div className={styles.steps}><strong>2</strong> / 2 STEPS</div>
            <form className={styles.form} onSubmit={handleDetailsSubmit}>
                <select className={styles.input} ref={supporterTypeRef} required>
                    <option value="Social Worker">Social Worker</option>
                    <option value="Psychologist">Psychologist</option>
                    <option value="Bereaved Person (at least 10 years)">Bereaved Person (at least 10 years)</option>
                </select>
                <div className={styles.alert} ref={alertDivRef}></div>
                <button className={styles.button} type="submit">
                    submit
                </button>
            </form>
            {error && <p>{error}</p>}
        </>
    );
};

export default SupporterDetails;
