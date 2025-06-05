import { Outlet } from "react-router-dom";
import HeaderUnlogged from "../components/layout/HeaderUnlogged"
//Ce composant sert de structure de base pour les pages nécessitant une authentification
const PublicLayout = () => {
  return (
    <div className="layout-container">
      <HeaderUnlogged />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
