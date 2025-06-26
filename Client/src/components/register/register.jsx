
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './register.module.css';
import ApiClientRequests from '../../services/ApiClientRequests'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2, 'יש להזין שם משתמש תקין'),
    email: z.string().email('אימייל לא תקין'),
    password: z.string().min(6, 'סיסמה חייבת לכלול לפחות 6 תווים'),
    passwordVer: z.string(),
    role: z.enum(['bereaved', 'supporter'], 'יש לבחור תפקיד'),
}).refine((data) => data.password === data.passwordVer, {
    message: 'הסיסמאות אינן תואמות',
    path: ['passwordVer']
});

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordVer: '',
        role: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checkUserOrEmailExists = async (username, email) => {
        try {
            const res = await ApiClientRequests.postRequest('users/check-existence', {
                username,
                email
            });
            return res;
        } catch (err) {
            toast.error('שגיאה בבדיקת זמינות המשתמש');
            return { usernameExists: false, emailExists: false };
        }
    };

    const handleRegisterSubmit = async (event) => {
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

        const { usernameExists, emailExists } = await checkUserOrEmailExists(formData.name, formData.email);
        if (usernameExists) {
            toast.error('שם המשתמש כבר קיים במערכת');
            return;
        }
        if (emailExists) {
            toast.error('אימייל זה כבר רשום במערכת');
            return;
        }

        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        };
        const path = formData.role === 'bereaved'
            ? '/bereavedDetails'
            : '/supporterDetails';

        navigate(path, { state: { newUser } });
    };

    return (
        <>
            <h3 className={styles.title}>חשבון חדש</h3>
            <div className={styles.steps}><strong>1</strong> / 2 שלבים</div>
            <form className={styles.container} onSubmit={handleRegisterSubmit}>
                <input
                    className={styles.input}
                    name="name"
                    type="text"
                    placeholder="שם מלא"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}

                <input
                    className={styles.input}
                    name="email"
                    type="email"
                    placeholder="אימייל"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}

                <input
                    className={styles.input}
                    name="password"
                    type="password"
                    placeholder="סיסמה"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}

                <input
                    className={styles.input}
                    name="passwordVer"
                    type="password"
                    placeholder="אימות סיסמה"
                    value={formData.passwordVer}
                    onChange={handleChange}
                    required
                />
                {errors.passwordVer && <p className={styles.errorMessage}>{errors.passwordVer}</p>}

                <select
                    className={styles.input}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>בחר/י</option>
                    <option value="bereaved">אבל</option>
                    <option value="supporter">תומך</option>
                </select>
                {errors.role && <p className={styles.errorMessage}>{errors.role}</p>}

                <button className={styles.button} type="submit">המשך</button>
                <div className={styles.linkContainer}>כבר יש לך חשבון?</div>
                <Link className={styles.link} to="/login">התחברות</Link>
            </form>
        </>
    );
}
