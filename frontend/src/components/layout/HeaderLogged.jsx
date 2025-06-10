import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../store/AuthStore";
import "../../style/HeaderLogged.css";

const HeaderLogged = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path) => location.pathname === path;

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Fonction avec appel API pour la déconnexion
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Optionnel : appel API pour invalider le token côté serveur
      // await fetch('/api/logout', { method: 'POST' });
      
      // Nettoyer le state local
      logout();
      
      // Rediriger
      navigate("/login");
      
      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="header">
      <div to="/" className="logo-container">
      <img
        className="logo-fitrack"
        alt="Logo background"
        src={"..//images/logo-fitrack.png"}
      />
      </div>

    <Link to="/" className={isActive("/") ? "nav-active" : ""}>
      <img
        className="icon-fitrack"
        alt="Dashboard"
        src={
          isActive("/")
            ? "/images/dashboard-icon-active.svg"
            : "/images/dashboard-icon.svg"
        }
      />
    </Link>

    <Link to="/sessions" className={isActive("/sessions") ? "nav-active" : ""}>
      <img
        className="icon-fitrack"
        alt="Sessions"
        src={
          isActive("/sessions")
            ? "/images/sessions-icon-active.svg"
            : "/images/sessions-icon.svg"
        }
      />
    </Link>

    <Link to="/profile" className={isActive("/profile") ? "nav-active" : ""}>
      <img
        className="icon-fitrack"
        alt="Profile"
        src={
          isActive("/profile")
            ? "/images/profile-icon-active.svg"
            : "/images/profile-icon.svg"
        }
      />
    </Link>

        <div>
        <button 
          className="toggle-button" 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <img 
            src={isLoggingOut ? "..//images/logout-btn.svg" : "..//images/logout-btn.svg"} 
            alt={isLoggingOut ? "Déconnexion en cours" : "Déconnexion"} 
          />
        </button>
        </div>
      </div>
  );
};

export default HeaderLogged;