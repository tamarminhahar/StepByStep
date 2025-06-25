
import UpdateAddForm from './UpdateAddForm';
import { deleteEventById,updateParticipationStatus  } from './calendarService';
import { toast } from 'react-toastify';

function PopUpForm({ selectedDate, selectedEvent, onClose, onEventSaved, onEventDeleted }) {
    const alreadyResponded = selectedEvent?.participation_status !== null;
    async function handleDelete() {
        try {
            const response = await deleteEventById(selectedEvent.id);
            if (response.ok) {
                toast.success('האירוע נמחק בהצלחה');
                onEventDeleted();
                onClose();
            } else {
                toast.error('שגיאה בעת מחיקת האירוע');
            }
        } catch {
            toast.error('שגיאה כללית במחיקה');
        }
    }
    async function handleParticipation(status) {
    try {
        const response = await updateParticipationStatus(selectedEvent.id, status);
        if (response.ok) {
            toast.success('השתתפות עודכנה');
            onClose();
        } else {
            const error = await response.json();
            toast.error(error.error || 'שגיאה בעדכון השתתפות');
        }
    } catch {
        toast.error('שגיאת שרת');
    }
}

    return (
    <div className="modal">
        <h2>{selectedEvent ? 'עריכת אירוע' : 'הוספת אירוע'}</h2>

        {/* הצגת סטטוס השתתפות */}
        {selectedEvent?.participation_status && (
            <p>
                השתתפות: {selectedEvent.participation_status === 'confirmed' ? 'מאושר/ת' : 'סירבת'}
            </p>
        )}

{selectedEvent?.calendar_type === 'supporter' && !selectedEvent?.hasParticipated && (
    <div style={{ marginBottom: '1em' }}>
        <button onClick={() => handleParticipation('confirmed')}>אני בא/ה</button>
        <button onClick={() => handleParticipation('declined')}>לא יכול/ה</button>
    </div>
)}

        {/* טופס עדכון / הוספה */}
        <UpdateAddForm
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            onClose={onClose}
            onEventSaved={onEventSaved}
        />

        {/* כפתור מחיקה – רק אם זה אירוע קיים */}
        {selectedEvent && (
            <button type="button" onClick={handleDelete} style={{ color: 'red' }}>
                מחיקת אירוע
            </button>
        )}

        {/* כפתור סגירה */}
        <button onClick={onClose}>סגור</button>
    </div>
);

}

export default PopUpForm;
