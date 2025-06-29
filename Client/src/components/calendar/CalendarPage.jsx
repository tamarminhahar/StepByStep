import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import PopUpForm from "./PopUpForm";
import Nav from "../nav/Nav.jsx";
import { useCurrentUser } from "../hooks/useCurrentUser";
import APIRequests from "../../services/ApiClientRequests.js";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import styles from "./calendarStyle/calendarPage.module.css";
import { useNavigate } from "react-router-dom";

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data = await APIRequests.getRequest("api/calendar/my_calendar");
      const mapped = data.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start_date,
        end: event.end_date,
        color: event.color,
        extendedProps: {
          allDay: true,
          event_type: event.event_type,
          calendar_type: event.calendar_type,
          locked: event.locked,
          description: event.description,
        },
      }));
      setEvents(mapped);
    } catch (err) {
      toast.error("שגיאה בטעינת אירועים");
    }
  }
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get("eventId");

    if (location.pathname === "/calendar/new") {
      setSelectedDate(params.get("date"));
      setSelectedEvent(null);
    } else if
      ((location.pathname === "/calendar/edit" || location.pathname === "/calendar/view")
      && eventId
      && events.length > 0
    ) {
      const matched = events.find(ev => ev.id.toString() === eventId.toString());
      if (matched) {
        setSelectedEvent({
          id: matched.id,
          title: matched.title,
          start_date: matched.start,
          end_date: matched.end,
          event_type: matched.extendedProps.event_type,
          description: matched.extendedProps.description,
          color: matched.color,
          calendar_type: matched.extendedProps.calendar_type,
          locked: matched.extendedProps.locked,
          hasParticipated: matched.extendedProps.hasParticipated,
          participation_status: matched.extendedProps.participation_status
        });
        setSelectedDate(matched.start);
      }
    } else {
      setSelectedEvent(null);
      setSelectedDate(null);
    }
  }, [location, events]);

  function handleDateClick(dateInfo) {
    navigate(`/calendar/new?date=${dateInfo.dateStr}`);
  }

  function handleEventClick(clickInfo) {
    const event = clickInfo.event;
    const isLocked = event.extendedProps.locked === 1;
    const isBereaved = currentUser?.role === "bereaved";
    const addedBySupporter = event.extendedProps.calendar_type === "supporter";
    const canEdit = !(isLocked || (isBereaved && addedBySupporter));

    if (!canEdit) {
      navigate(`/calendar/view?eventId=${event.id}`);
      return;
    }
    navigate(`/calendar/edit?eventId=${event.id}`);
  }
  return (
    <div className={styles.calendarPageContainer}>
      <Nav />
      <div className={styles.calendarWrapper}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          locale="he"
          buttonText={{ today: "היום" }}
          height="auto"
        />
      </div>

      {location.pathname === "/calendar/new" && (
        <PopUpForm
          selectedDate={selectedDate}
          selectedEvent={null}
          onClose={() => navigate("/calendar")}
          onEventSaved={fetchEvents}
          onEventDeleted={fetchEvents}
        />
      )}

      {location.pathname === "/calendar/edit" && selectedEvent && (
        <PopUpForm
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onClose={() => navigate("/calendar")}
          onEventSaved={fetchEvents}
          onEventDeleted={fetchEvents}
        />
      )}
      {location.pathname === "/calendar/view" && selectedEvent && (
        <PopUpForm
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onClose={() => navigate("/calendar")}
          onEventSaved={fetchEvents}
          onEventDeleted={fetchEvents}
          viewOnly={true}
        />
      )}

    </div>
  );
}

export default CalendarPage;
