import React, { useRef, useState } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import styles from './userDetails.module.css'; // You can reuse the same CSS


// Bereaved Profile Form
const BereavedDetails = () => {
    const dateOfLossRef = useRef();
    const relationshipRef = useRef();
    const alertDivRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const location = useLocation();
    const { newUser } = location.state || {};
    // Function to display message in the alert div
    const manageMessages = (message) => {
        alertDivRef.current.innerText = message;
    };

    // Function to send the bereaved profile to server
    const writeProfileToDB = async () => {
      

        try {
            const userResponse  = await fetch('http://localhost:3000/users', {
                method: 'POST',
              headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!userResponse.ok) throw new Error(`Error: ${userResponse.status}`);
            const { id } = await userResponse.json();

            const body = {
                user_id: id,
                date_of_loss: dateOfLossRef.current.value,
                relationship_to_deceased: relationshipRef.current.value,
            };

            const profileResponse = await fetch('http://localhost:3000/users/bereaved_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!profileResponse.ok) throw new Error(`Error: ${profileResponse.status}`);

            localStorage.setItem('currentUser', JSON.stringify({name: newUser.name}));

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
