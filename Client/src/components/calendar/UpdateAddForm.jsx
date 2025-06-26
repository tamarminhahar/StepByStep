import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import APIRequests from "../../services/ApiClientRequests.js";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './calendarStyle/PopUpForm.module.css';

const eventSchema = z.object({
    title: z.string().min(2, 'הכותרת חייבת להכיל לפחות 2 תווים'),
    description: z.string().min(5, 'התיאור חייב להכיל לפחות 5 תווים'),
    event_type: z.string().optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'תאריך לא תקין'),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'תאריך לא תקין'),
    color: z.string().optional(),
});


function UpdateAddForm({ selectedDate, selectedEvent, onClose, onEventSaved }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(eventSchema)
    });
    const { currentUser } = useCurrentUser();

    useEffect(() => {
        reset({
            title: selectedEvent?.title || '',
            event_type: selectedEvent?.event_type || '',
            color: selectedEvent?.color || '#0000FF',
            end_date: formatDateOnly(selectedEvent?.end_date || selectedDate),
            start_date: formatDateOnly(selectedEvent?.start_date || selectedDate),
            description: selectedEvent?.description || '',
        });
    }, [selectedEvent, selectedDate, reset]);

    function formatDateOnly(dateString) {
        return new Date(dateString).toISOString().split('T')[0];
    }

    async function onSubmit(data) {
       const eventData = {
        ...data,
        calendar_type: currentUser.role,
        start_date: formatDateOnly(selectedEvent?.start_date || selectedDate),
        end_date: formatDateOnly(data.end_date),
        apply_to_all: currentUser.role === "supporter",
        user_id: currentUser.role === "bereaved" ? parseInt(currentUser.id) : null,
        created_by_supporter_id: currentUser.role === "supporter" ? parseInt(currentUser.id) : null,
        id: selectedEvent?.id,
    };

        try {
            if (selectedEvent) {
                await APIRequests.putRequest(`api/calendar/${selectedEvent.id}`, eventData);
                toast.success("האירוע עודכן בהצלחה");
            } else {
                await APIRequests.postRequest("api/calendar", eventData);
                toast.success("האירוע נוסף בהצלחה");
            }
            onEventSaved();
            onClose();
        } catch (error) {
            toast.error(error.message || "שגיאה בעת שמירת האירוע");
        }
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContent}>
            <label>כותרת:</label>
            <input {...register('title', { required: 'שדה חובה' })} />
            {errors.title && <span style={{ color: 'red' }}>{errors.title.message}</span>}

            <label>סוג אירוע:</label>
            <input {...register('event_type')} />

            <label>תיאור:</label>
            <textarea {...register('description', { required: 'שדה חובה' })} />
            {errors.description && <span style={{ color: 'red' }}>{errors.description.message}</span>}

            <label>תאריך התחלה:</label>
            <input type="date" {...register('start_date', { required: 'שדה חובה' })} readOnly />
            <label>תאריך סיום:</label>
            <input
                type="date"
                {...register('end_date', { required: 'שדה חובה' })}
                min={selectedEvent?.start_date || selectedDate ? formatDateOnly(selectedEvent?.start_date || selectedDate) : undefined}
            />
            {errors.end_date && <span style={{ color: 'red' }}>{errors.end_date.message}</span>}
            <label>צבע:</label>
            <input type="color" {...register('color')} />
            <div className={styles.actions}>

                <button type="submit">אישור</button>
                <button type="button" onClick={onClose}>ביטול</button>
            </div>
        </form>
    );
}

export default UpdateAddForm;
