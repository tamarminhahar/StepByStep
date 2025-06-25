
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { useEffect, useState } from 'react';
// import PopUpForm from './PopUpForm.jsx';
// import Nav from '../nav/nav.jsx';
// import { useCurrentUser } from '../hooks/useCurrentUser.js';
// import { fetchUserEvents } from './calendarService.js';
// import { toast } from 'react-toastify';
// import { useLocation } from 'react-router-dom';
// im

// function CalendarPage() {
//     const [events, setEvents] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const { currentUser } = useCurrentUser();
//     const location = useLocation(); 

//     useEffect(() => {
//         fetchEvents();
//     }, []);

//     async function fetchEvents() {
//         try {
//             const data = await fetchUserEvents();
//             const mapped = data.map(event => ({
//                 id: event.id,
//                 title: event.title,
//                 start: event.start_date,
//                 end: event.end_date,
//                 color: event.color,
//                 extendedProps: {
//                     allDay: true,
//                     event_type: event.event_type,
//                     calendar_type: event.calendar_type,
//                     locked: event.locked,
//                     description: event.description,
//                 },
//             }));
//             setEvents(mapped);
//         } catch (err) {
//             console.error('Error fetching events:', err);
//             toast.error('שגיאה בטעינת אירועים');
//         }
//     }
//       useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const eventId = params.get('eventId');

//         if (eventId && events.length > 0) {
//             const matched = events.find(e => e.id === Number(eventId));
//             if (matched) {
//                 setSelectedEvent({
//                     id: matched.id,
//                     title: matched.title,
//                     start_date: matched.start,
//                     end_date: matched.end,
//                     event_type: matched.extendedProps.event_type,
//                     description: matched.extendedProps.description,
//                     color: matched.color,
//                     calendar_type: matched.extendedProps.calendar_type,
//                     locked: matched.extendedProps.locked
//                 });
//                 setShowModal(true);
//             }
//         }
//     }, [location.search, events]);


//     function handleDateClick(dateInfo) {
//         setSelectedDate(dateInfo.dateStr);
//         setSelectedEvent(null);
//         setShowModal(true);
//     }

//     function handleEventClick(clickInfo) {
//         const event = clickInfo.event;
//         const isLocked = event.extendedProps.locked === true;
//         const isBereaved = currentUser?.role === 'bereaved';
//         const addedBySupporter = event.extendedProps.calendar_type === 'supporter';
//         const canEdit = !(isLocked || (isBereaved && addedBySupporter));

//         if (!canEdit) toast.info('אין לך הרשאה לערוך את האירוע');

//         setSelectedDate(event.startStr);
//         setSelectedEvent({
//             id: event.id,
//             title: event.title,
//             start_date: event.startStr,
//             end_date: event.endStr,
//             event_type: event.extendedProps.event_type,
//             description: event.extendedProps.description,
//             color: event.backgroundColor || event.color,
//             calendar_type: event.extendedProps.calendar_type,
//             locked: event.extendedProps.locked,
//         });
//         setShowModal(true);
//     }

//     return (
//         <div>
//             <Nav />
//             <FullCalendar
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView="dayGridMonth"
//                 events={events}
//                 dateClick={handleDateClick}
//                 eventClick={handleEventClick}
//             />
//             {showModal && (
//                 <PopUpForm
//                     selectedDate={selectedDate}
//                     selectedEvent={selectedEvent}
//                     onClose={() => setShowModal(false)}
//                     onEventSaved={fetchEvents}
//                     onEventDeleted={fetchEvents}
//                 />
//             )}
//         </div>
//     );
// }

// export default CalendarPage;

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import PopUpForm from './PopUpForm';
import Nav from '../nav/nav.jsx';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { fetchUserEvents } from './calendarService.js';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import styles from './calendarStyle/calendarPage.module.css';

function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { currentUser } = useCurrentUser();
    const location = useLocation();

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const data = await fetchUserEvents();
            const mapped = data.map(event => ({
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
            console.error('Error fetching events:', err);
            toast.error('שגיאה בטעינת אירועים');
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const eventId = params.get('eventId');

        if (eventId && events.length > 0) {
            const matched = events.find(e => e.id === Number(eventId));
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
                    locked: matched.extendedProps.locked
                });
                setShowModal(true);
            }
        }
    }, [location.search, events]);

    function handleDateClick(dateInfo) {
        setSelectedDate(dateInfo.dateStr);
        setSelectedEvent(null);
        setShowModal(true);
    }

    function handleEventClick(clickInfo) {
        const event = clickInfo.event;
        const isLocked = event.extendedProps.locked === true;
        const isBereaved = currentUser?.role === 'bereaved';
        const addedBySupporter = event.extendedProps.calendar_type === 'supporter';
        const canEdit = !(isLocked || (isBereaved && addedBySupporter));

        if (!canEdit) toast.info('אין לך הרשאה לערוך את האירוע');

        setSelectedDate(event.startStr);
        setSelectedEvent({
            id: event.id,
            title: event.title,
            start_date: event.startStr,
            end_date: event.endStr,
            event_type: event.extendedProps.event_type,
            description: event.extendedProps.description,
            color: event.backgroundColor || event.color,
            calendar_type: event.extendedProps.calendar_type,
            locked: event.extendedProps.locked,
        });
        setShowModal(true);
    }

    return (
        <div className="calendarPageContainer">
            <Nav />
            <div className="calendarWrapper">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    locale="he"
                    buttonText={{
                        today: 'היום'
                    }}
                    height="auto"
                />
            </div>
            {showModal && (
                <PopUpForm
                    selectedDate={selectedDate}
                    selectedEvent={selectedEvent}
                    onClose={() => setShowModal(false)}
                    onEventSaved={fetchEvents}
                    onEventDeleted={fetchEvents}
                />
            )}
        </div>
    );
}

export default CalendarPage;
