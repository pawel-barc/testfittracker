import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import { getSessions } from "../api/sessionApi";

const SessionCalendar = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await getSessions();
      setSessions(data);
    };
    loadSessions();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const dateStr = date.toISOString().split("T")[0]; // yyyy-mm-dd
    const filtered = sessions.filter((s) => s.date.split("T")[0] === dateStr);
    setSelectedSessions(filtered);
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const hasSession = sessions.some((s) => s.date.split("T")[0] === dateStr);
    return hasSession ? "has-session" : null;
  };

  return (
    <div>
      <h2>Calendrier des séances</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
      />

      <div style={{ marginTop: "1rem" }}>
        {selectedSessions.length > 0 ? (
          <>
            <h3>Séances du {selectedDate?.toLocaleDateString()}</h3>
            <ul>
              {selectedSessions.map((s) => (
                <li key={s.id}>
                  {s.title} ({s.duration} min)
                </li>
              ))}
            </ul>
          </>
        ) : (
          selectedDate && <p>Aucune séance ce jour-là.</p>
        )}
      </div>
      <style>{`
        .has-session {
          background: #c8f7c5 !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default SessionCalendar;
