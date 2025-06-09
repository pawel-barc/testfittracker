import { useEffect, useState } from "react";
import { getUserSessions } from "../api/sessionApi";
import { useNavigate } from "react-router-dom";

const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await getUserSessions();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  return (
    <div>
      <h2>Mes séances</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
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
