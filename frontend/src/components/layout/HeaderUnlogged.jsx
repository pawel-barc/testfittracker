import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../../style/HeaderUnlogged.css";
import "../../assets/images/logo-fitrack.png";

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
      <img
        className="logo-fitrack"
        alt="Logo background"
        src={"../../../src/assets/images/logo-fitrack.png"}
      />
    </div>
  );
};

export default HeaderUnlogged;