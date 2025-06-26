
import React, { useState } from 'react';
import styles from './login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import ApiClientRequests from '../../services/ApiClientRequests'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';

const loginSchema = z.object({
    name: z.string().min(2, 'יש להזין שם משתמש תקין'),
    password: z.string().min(6, 'סיסמה חייבת לכלול לפחות 4 תווים')
});

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors = {};
            validation.error.errors.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        try {
            const data = await ApiClientRequests.postRequest('users/login', {
                name: formData.name,
                password: formData.password,
            });
            navigate('/home');

        } catch (err) {
            console.error(err);
            toast.error('שם משתמש או סיסמה שגויים, נסה שוב');
        }
    };

    return (
        <div className={styles.loginForm}>
            <div id="container" className={styles.container}>
                <h3 className={styles.title}>התחברות</h3>
                <form onSubmit={handleLoginSubmit} className={styles.form}>
                    <input
                        name="name"
                        type="text"
                        placeholder="שם משתמש"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}

                    <input
                        name="password"
                        type="password"
                        placeholder="סיסמה"
                        className={styles.input}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}

                    <button type="submit" className={styles.button}>שליחה</button>

                    <div className={styles.linkContainer}>
                        <span>פעם ראשונה כאן? </span>
                        <Link to="/register" className={styles.link}>להרשמה</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
