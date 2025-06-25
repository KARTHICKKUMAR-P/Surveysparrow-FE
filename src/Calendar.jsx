import { useState } from 'react';
import './calendar.css';
import eventsData from './events.json';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [search, setSearch] = useState('');

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Build calendar grid as a 2D array for table rows
  const calendarCells = [];
  let week = [];
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(currentYear, currentMonth, d));
    if (week.length === 7) {
      calendarCells.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendarCells.push(week);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter events for the current month
  const monthEvents = eventsData.filter(
    (event) =>
      new Date(event.date).getMonth() === currentMonth &&
      new Date(event.date).getFullYear() === currentYear
  );

  // Filter by search term
  const filteredEvents = monthEvents.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="calendar-flex-layout">
      <div className="calendar-main">
        <div className="gc-calendar-header">
          <select
            value={currentMonth}
            onChange={e => setCurrentMonth(Number(e.target.value))}
            className="gc-month-select"
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>{name}</option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={e => setCurrentYear(Number(e.target.value))}
            className="gc-year-select"
          >
            {Array.from({ length: 21 }, (_, i) => currentYear - 10 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <table className="gc-calendar-table">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarCells.map((week, i) => (
              <tr key={i}>
                {week.map((date, idx) => {
                  if (!date) return <td key={idx} className="gc-empty"></td>;
                  const isToday = isSameDay(date, today);
                  // Find events for this date
                  const dayEvents = eventsData.filter(
                    (event) => event.date === date.toISOString().slice(0, 10)
                  );
                  return (
                    <td
                      key={idx}
                      className={`gc-date-cell${isToday ? ' gc-today' : ''}`}
                    >
                      <div className="gc-date-number">{date.getDate()}</div>
                      <div className="gc-events-list">
                        {dayEvents.map((event, j) => (
                          <span
                            key={j}
                            className="gc-event-square"
                            style={{ background: event.color || "#4285f4" }}
                            title={event.title}
                          ></span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <aside className="calendar-sidebar-right">
        <input
          type="text"
          className="calendar-search"
          placeholder="Search by title"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ul className="calendar-event-list">
          {filteredEvents.length === 0 && <li>No events found.</li>}
          {filteredEvents.map((event, idx) => (
            <li key={idx} className="calendar-event-item">
              <span
                className="gc-event-square"
                style={{ background: event.color || "#4285f4", marginRight: 8 }}
              ></span>
              <strong>{event.title}</strong>
              <div style={{ fontSize: '0.95em', color: '#666' }}>
                {event.date} | {event.startTime} - {event.endTime}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}