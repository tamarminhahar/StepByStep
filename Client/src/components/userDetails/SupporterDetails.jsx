
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './userDetails.module.css';
import ApiClientRequests from '../../services/ApiClientRequests'
import { toast } from 'react-toastify';
import { z } from 'zod';
import 'react-toastify/dist/ReactToastify.css';

const schema = z.object({
    profession_type: z.string().min(1, 'נא לבחור תחום מקצועי')
});

const SupporterDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { newUser } = location.state || {};
    const [formData, setFormData] = useState({ profession_type: '' });
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
            await ApiClientRequests.postRequest('users/supporter_profile', formData);
            navigate('/home', { replace: true });
        } catch (err) {
            setError(err.message);
            toast.error('אירעה שגיאה בשמירת הפרופיל');
        }
    };

    return (
        <>
            <h3 className={styles.title}>פרופיל תומך</h3>
            <div className={styles.steps}><strong>2</strong> / 2 שלבים</div>
            <form className={styles.form} onSubmit={handleDetailsSubmit}>
                <select
                    className={styles.input}
                    name="profession_type"
                    value={formData.profession_type}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>בחר/י תחום מקצועי</option>
                    <option value="עובד/ת סוציאלית">עובד/ת סוציאלית</option>
                    <option value="פסיכולוג/ית">פסיכולוג/ית</option>
                    <option value="אדם שכול (מעל 10 שנים)">אדם שכול (מעל 10 שנים)</option>
                </select>
                {errors.profession_type && <p className={styles.errorMessage}>{errors.profession_type}</p>}

                <button className={styles.button} type="submit">שליחה</button>
            </form>
            {error && <p className={styles.errorMessage}>שגיאה: {error}</p>}
        </>
    );
};

export default SupporterDetails;
