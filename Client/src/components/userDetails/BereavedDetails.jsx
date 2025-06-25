
// import React, { useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import styles from './userDetails.module.css';
// import ApiClientRequests from '../../ApiClientRequests';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const BereavedDetails = () => {
//     const dateOfLossRef = useRef();
//     const relationshipRef = useRef();
//     const navigate = useNavigate();
//     const [error, setError] = useState(null);
//     const location = useLocation();
//     const { newUser } = location.state || {};

//     const writeProfileToDB = async () => {
//         try {
//             const user = await ApiClientRequests.postRequest('users', newUser);

//             const profileBody = {
//                 date_of_loss: dateOfLossRef.current.value,
//                 relationship_to_deceased: relationshipRef.current.value,
//             };

//             await ApiClientRequests.postRequest('users/bereaved_profile', profileBody);

//             toast.success('הפרופיל נוצר בהצלחה!');
//             navigate(`/home`, { replace: true });

//         } catch (err) {
//             console.error(err);
//             setError(err.message);
//             toast.error('אירעה שגיאה בשמירת הפרופיל');
//         }
//     };

//     const handleDetailsSubmit = (event) => {
//         event.preventDefault();
//         writeProfileToDB();
//     };

//     return (
//         <>
//             <h3 className={styles.title}>פרופיל אבל</h3>
//             <div className={styles.steps}><strong>2</strong> / 2 שלבים</div>
//             <form className={styles.form} onSubmit={handleDetailsSubmit}>
//                 <label className={styles.label}>תאריך פטירה</label>
//                 <input
//                     className={styles.input}
//                     ref={dateOfLossRef}
//                     type="date"
//                     max={new Date().toISOString().split('T')[0]}
//                     required
//                 />
//                 <select className={styles.input} ref={relationshipRef} required defaultValue="">
//                     <option value="" disabled hidden>בחר/י קשר לנפטר/ת</option>
//                     <option value="הורה">הורה</option>
//                     <option value="אח/ות">אח/ות</option>
//                     <option value="בן/בת זוג">בן/בת זוג</option>
//                     <option value="ילד/ה">ילד/ה</option>
//                     <option value="חבר/ה">חבר/ה</option>
//                     <option value="סבא/סבתא">סבא/סבתא</option>
//                     <option value="קרוב משפחה רחוק">קרוב משפחה רחוק</option>
//                 </select>



//                 <button className={styles.button} type="submit">שליחה</button>
//             </form>
//             {error && <p className={styles.errorMessage}>שגיאה: {error}</p>}
//         </>
//     );
// };

// export default BereavedDetails;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './userDetails.module.css';
import ApiClientRequests from '../../ApiClientRequests';
import { toast } from 'react-toastify';
import { z } from 'zod';
import 'react-toastify/dist/ReactToastify.css';

const schema = z.object({
    date_of_loss: z.string().min(1, 'נא להזין תאריך תקין'),
    relationship_to_deceased: z.string().min(1, 'נא לבחור קשר לנפטר/ת')
});

const BereavedDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { newUser } = location.state || {};
    const [formData, setFormData] = useState({ date_of_loss: '', relationship_to_deceased: '' });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (event) => {
        event.preventDefault();

        const validation = schema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors = {};
            validation.error.errors.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        try {
            const user = await ApiClientRequests.postRequest('users', newUser);
            await ApiClientRequests.postRequest('users/bereaved_profile', formData);
            navigate('/home', { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.message);
            toast.error('אירעה שגיאה בשמירת הפרופיל');
        }
    };

    return (
        <>
            <h3 className={styles.title}>פרופיל אבל</h3>
            <div className={styles.steps}><strong>2</strong> / 2 שלבים</div>
            <form className={styles.form} onSubmit={handleDetailsSubmit}>
                <label className={styles.label}>תאריך פטירה</label>
                <input
                    className={styles.input}
                    name="date_of_loss"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.date_of_loss}
                    onChange={handleChange}
                    required
                />
                {errors.date_of_loss && <p className={styles.errorMessage}>{errors.date_of_loss}</p>}

                <select
                    className={styles.input}
                    name="relationship_to_deceased"
                    value={formData.relationship_to_deceased}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>בחר/י קשר לנפטר/ת</option>
                    <option value="הורה">הורה</option>
                    <option value="אח/ות">אח/ות</option>
                    <option value="בן/בת זוג">בן/בת זוג</option>
                    <option value="ילד/ה">ילד/ה</option>
                    <option value="חבר/ה">חבר/ה</option>
                    <option value="סבא/סבתא">סבא/סבתא</option>
                    <option value="קרוב משפחה רחוק">קרוב משפחה רחוק</option>
                </select>
                {errors.relationship_to_deceased && <p className={styles.errorMessage}>{errors.relationship_to_deceased}</p>}

                <button className={styles.button} type="submit">שליחה</button>
            </form>
            {error && <p className={styles.errorMessage}>שגיאה: {error}</p>}
        </>
    );
};

export default BereavedDetails;
