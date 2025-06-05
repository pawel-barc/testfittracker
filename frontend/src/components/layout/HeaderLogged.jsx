import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../../style/HeaderLogged.css";

const HeaderLogged = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fonction pour checker si un lien est actif
  const isActive = (path) => location.pathname === path;

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header-logged">
      <div className="header-container">
        <div className="logo-container">
          <img src="testfitracker/frontend/assets/images/logo-fitrack.png" alt="logo-fitrack" />
        </div>

        {/* Lien vers Dashboard */}
        <Link to="/" className={isActive("/") ? "nav-active" : ""}>
          Dashboard
        </Link>

        <Link to="/sessions" className={isActive("/sessions") ? "nav-active" : ""}>
          Sessions
        </Link>

        <Link to="/profile" className={isActive("/profile") ? "nav-active" : ""}>
          Profile
        </Link>

        <div>
          <button className="toggle-button" onClick={handleToggle}>
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderLogged;