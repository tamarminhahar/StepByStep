import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import { createOrUpdateEvent } from './calendarService';

function UpdateAddForm({ selectedDate, selectedEvent, onClose, onEventSaved }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
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
            start_date: selectedEvent?.start_date || selectedDate,
            apply_to_all: currentUser.role === 'supporter',
            user_id: currentUser.role === 'bereaved' ? parseInt(currentUser.id) : null,
            created_by_supporter_id: currentUser.role === 'supporter' ? parseInt(currentUser.id) : null,
            id: selectedEvent?.id
        };

        try {
            const response = await createOrUpdateEvent(eventData, !!selectedEvent);
            if (response.ok) {
                toast.success(selectedEvent ? 'האירוע עודכן בהצלחה' : 'האירוע נוסף בהצלחה');
                onEventSaved();
                onClose();
            } else {
                toast.error('שגיאה בעת שמירת האירוע');
            }
        } catch {
            toast.error('שגיאה כללית');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <input type="date" {...register('end_date', { required: 'שדה חובה' })} />
            {errors.end_date && <span style={{ color: 'red' }}>{errors.end_date.message}</span>}

            <label>צבע:</label>
            <input type="color" {...register('color')} />

            <button type="submit">אישור</button>
        </form>
    );
}

export default UpdateAddForm;
