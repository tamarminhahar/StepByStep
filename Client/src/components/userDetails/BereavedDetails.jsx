
import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './userDetails.module.css';


const BereavedDetails = () => {
    const dateOfLossRef = useRef();
    const relationshipRef = useRef();
    const alertDivRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const location = useLocation();
    const { newUser } = location.state || {};

    const manageMessages = (message) => {
        if (alertDivRef.current) {
            alertDivRef.current.innerText = message;
        }
    };

    const writeProfileToDB = async () => {
        try {
            const userResponse = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
                credentials: 'include',
            });

            if (!userResponse.ok) throw new Error(`User creation failed (${userResponse.status})`);

            const { id, role } = await userResponse.json();

            const profileBody = {
                date_of_loss: dateOfLossRef.current.value,
                relationship_to_deceased: relationshipRef.current.value,
            };

            const profileResponse = await fetch('http://localhost:3000/users/bereaved_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileBody),
                credentials: 'include',
            });

            if (!profileResponse.ok) throw new Error(`Profile creation failed (${profileResponse.status})`);

            // const currentUser = { id, name: newUser.name, role };
            // setCurrentUser(currentUser);
            // Cookies.set('currentUser', JSON.stringify(currentUser));

            navigate('/home');
        } catch (err) {
            console.error(err);
            setError(err.message);
            manageMessages(err.message);
        }
    };

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
                    Submit
                </button>
            </form>
            {error && <p className={styles.errorMessage}>Error: {error}</p>}
        </>
    );
};

export default BereavedDetails;
