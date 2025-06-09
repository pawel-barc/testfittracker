import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { useEffect } from "react";

const WelcomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="welcome-page">
      <h1>Bienvenue sur FitTrack</h1>
      <p>
        Transforme ton entraînement avec notre plateforme : organise, planifie
        et dépasse tes limites comme un pro !
      </p>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/login")}>Connexion</button>
        <button onClick={() => navigate("/register")}>Inscription</button>
      </div>
    </div>
  );
};

export default WelcomePage;
