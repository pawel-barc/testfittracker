import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import { getSessions } from "../api/sessionApi";
import { useNavigate } from "react-router-dom";

const SessionCalendar = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

    // Ouvrir la modal
    setIsModalOpen(true);
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const hasSession = sessions.some((s) => s.date.split("T")[0] === dateStr);
    return hasSession ? "has-session" : null;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="user-calendar">
      <div className="user-calendar-header">
        <h2>Calendrier des séances</h2>
      </div>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
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
              <p>Aucune séance ce jour-là.</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        .has-session {
          background: #c8f7c5 !important;
          border-radius: 50%;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          width: 80%;
          max-width: 500px;
          max-height: 40%;
          overflow-y: auto;
          text-align: center;
          position: relative;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SessionCalendar;
