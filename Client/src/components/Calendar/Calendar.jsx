

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';


    const Calendar = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        // כאן בעתיד תעשי fetch לשרת שלך ל־API שיחזיר את האירועים הרלוונטיים
        // כרגע שמים כמה אירועים לבדיקה:

        setEvents([
            { title: 'Shiva - Day 1', date: '2025-06-11' },
            { title: 'Shloshim', date: '2025-07-10' },
            { title: 'Supporter Event - Meeting', date: '2025-06-15' },
            { title: 'Personal Event', date: '2025-06-20' }
        ]);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={false}
                selectable={false}
                events={events}
                dateClick={(info) => {
                    alert('Clicked on date: ' + info.dateStr);
                }}
                eventClick={(info) => {
                    alert('Clicked on event: ' + info.event.title);
                }}
            />
        </div>
    );
}
export default Calendar;
