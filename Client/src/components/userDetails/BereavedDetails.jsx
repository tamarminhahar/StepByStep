import React, { useRef, useState } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import styles from './userDetails.module.css'; // You can reuse the same CSS
import { useCurrentUser } from '../userProvider.jsx';

// Bereaved Profile Form
const BereavedDetails = () => {
    const dateOfLossRef = useRef();
    const relationshipRef = useRef();
    const alertDivRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
        const { setCurrentUser } = useCurrentUser();    const location = useLocation();
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
            // const { id } = await userResponse.json();
             const { id, token, role } = await userResponse.json();
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            const body = {
              //  user_id: id,
                date_of_loss: dateOfLossRef.current.value,
                relationship_to_deceased: relationshipRef.current.value,
            };

            const profileResponse = await fetch('http://localhost:3000/users/bereaved_profile', {
                method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });

            if (!profileResponse.ok) throw new Error(`Error: ${profileResponse.status}`);

        //    const currentUser = { name: newUser.name };
                  const currentUser = { id, name: newUser.name, role };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            setCurrentUser(currentUser);

            navigate('/home');
        } catch (err) {
            setError(err.message);
        }
    };
React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'bereaved') {
        navigate('/home');
    }
}, [navigate]);

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
