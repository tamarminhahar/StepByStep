import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './userDetails.module.css'; // You can reuse the same CSS

// Bereaved Profile Form
const BereavedDetails = () => {
    const dateOfLossRef = useRef();
    const relationshipRef = useRef();
    const alertDivRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');

    // Function to display message in the alert div
    const manageMessages = (message) => {
        alertDivRef.current.innerText = message;
    };

    // Function to send the bereaved profile to server
    const writeProfileToDB = async () => {
        const body = {
            user_id: currentUser.id,
            date_of_loss: dateOfLossRef.current.value,
            relationship_to_deceased: relationshipRef.current.value,
        };

        try {
            const response = await fetch('http://localhost:3000/bereaved_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send JWT token
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

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
            <h3 className={styles.title}>Bereaved Profile</h3>
            <div className={styles.steps}><strong>2</strong> / 2 STEPS</div>
            <form className={styles.form} onSubmit={handleDetailsSubmit}>
                <input
                    className={styles.input}
                    ref={dateOfLossRef}
                    type="date"
                    placeholder="Date of loss"
                    required
                />
                <select className={styles.input} ref={relationshipRef} required>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="In-Law">In-Law</option>
                    <option value="Cousin">Cousin</option>
                    <option value="Distant Relative">Distant Relative</option>
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

export default BereavedDetails;
