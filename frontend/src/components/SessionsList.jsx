import { useEffect, useState } from "react";
import { getSessions } from "../api/sessionApi";
import { useNavigate } from "react-router-dom";

const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await getSessions();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  return (
    <div>
      <h2>Mes séances</h2>
      <ul className="session-list-div">
        {sessions.map((session) => (
          <li key={session.id} className="session-list-item">
            <button onClick={() => navigate(`/sessions/${session.id}`)}>
              {session.title} - {new Date(session.date).toLocaleDateString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SessionsList;
