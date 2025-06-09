import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../../style/HeaderUnlogged.css";
import "../../../public/images/logo-fitrack.png";

const HeaderUnlogged = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fonction pour checker si un lien est actif
  const isActive = (path) => location.pathname === path;

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="header">
      <Link to="/" className="logo-container">
      <img
        className="logo-fitrack"
        alt="Logo background"
        src={"../../../public/images/logo-fitrack.png"}
      />
      </Link>
    </div>
  );
};

export default HeaderUnlogged;