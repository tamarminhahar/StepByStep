import UpdateAddForm from "./UpdateAddForm.jsx";
import APIRequests from "../../services/ApiClientRequests.js";
import { toast } from "react-toastify";
import style from "./calendarStyle/PopUpForm.module.css";

function PopUpForm({
  selectedDate,
  selectedEvent,
  onClose,
  onEventSaved,
  onEventDeleted,
  viewOnly
}) {
  const alreadyResponded = selectedEvent?.participation_status !== null;

  async function handleDelete() {
    try {
      await APIRequests.deleteRequest(`api/calendar/${selectedEvent.id}`);
      toast.success("האירוע נמחק בהצלחה");
      onEventDeleted();
      onClose();
    } catch {
      toast.error("שגיאה בעת מחיקת האירוע");
    }
  }

  async function handleParticipation(status) {
    try {
      await APIRequests.patchRequest(
        `api/calendar/${selectedEvent.id}/participation`,
        { status }
      );
      toast.success("השתתפות עודכנה");
      onClose();
    } catch (error) {
      toast.error(error.message || "שגיאה בעדכון השתתפות");
    }
  }

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <button className={style.closeButton} onClick={onClose}>X</button>

        <h2>{viewOnly ? "פרטי אירוע" : selectedEvent ? "עריכת אירוע" : "הוספת אירוע"}</h2>

        {selectedEvent?.participation_status && (
          <p>
            השתתפות:{" "}
            {selectedEvent.participation_status === "confirmed"
              ? "מאושר/ת"
              : "סירבת"}
          </p>
        )}

        {viewOnly ? (
          <div>
            <p><strong>כותרת:</strong> {selectedEvent?.title}</p>
            <p><strong>תיאור:</strong> {selectedEvent?.description}</p>
            <p><strong>סוג אירוע:</strong> {selectedEvent?.event_type}</p>
            <p><strong>תאריך התחלה:</strong> {selectedEvent?.start_date}</p>
            <p><strong>תאריך סיום:</strong> {selectedEvent?.end_date}</p>

            {selectedEvent?.calendar_type === "supporter" && !selectedEvent?.hasParticipated && (
              <div className={style.participationButtons}>
                <button onClick={() => handleParticipation("confirmed")}>
                  אני בא/ה
                </button>
                <button onClick={() => handleParticipation("declined")}>
                  לא יכול/ה
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <UpdateAddForm
              selectedDate={selectedDate}
              selectedEvent={selectedEvent}
              onClose={onClose}
              onEventSaved={onEventSaved}
            />

            <div className={style.actions}>
              {selectedEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{ color: "red" }}
                >
                  מחיקת אירוע
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

//   return (
//     <div className={style.modalOverlay}>
//       <div className={style.modalContent}>
//         <h2>{selectedEvent ? "עריכת אירוע" : "הוספת אירוע"}</h2>

//         {selectedEvent?.participation_status && (
//           <p>
//             השתתפות:{" "}
//             {selectedEvent.participation_status === "confirmed"
//               ? "מאושר/ת"
//               : "סירבת"}
//           </p>
//         )}

//         {selectedEvent?.calendar_type === "supporter" &&
//           !selectedEvent?.hasParticipated && (
//             <div className={style.participationButtons}>
//               <button onClick={() => handleParticipation("confirmed")}>
//                 אני בא/ה
//               </button>
//               <button onClick={() => handleParticipation("declined")}>
//                 לא יכול/ה
//               </button>
//             </div>
//           )}
          
//         {viewOnly ? (
//           <div>
//             <p><strong>כותרת:</strong> {selectedEvent?.title}</p>
//             <p><strong>תיאור:</strong> {selectedEvent?.description}</p>
//             <p><strong>סוג אירוע:</strong> {selectedEvent?.event_type}</p>
//             <p><strong>תאריך התחלה:</strong> {selectedEvent?.start_date}</p>
//             <p><strong>תאריך סיום:</strong> {selectedEvent?.end_date}</p>
//           </div>
//         ) : (
//           <UpdateAddForm
//             selectedDate={selectedDate}
//             selectedEvent={selectedEvent}
//             onClose={onClose}
//             onEventSaved={onEventSaved}
//           />
//         )}
//         <div className={style.actions}>
// {selectedEvent && !viewOnly && (
//   <button
//     type="button"
//     onClick={handleDelete}
//     style={{ color: "red" }}
//   >
//     מחיקת אירוע
//   </button>
// )}
//         </div>
//       </div>

//     </div>
//   );


export default PopUpForm;
