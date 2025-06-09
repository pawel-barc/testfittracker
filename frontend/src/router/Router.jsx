import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Sessions from "../pages/Sessions";
import PrivateLayout from "../layout/PrivateLayout";
import PublicLayout from "../layout/PublicLayout";
import useAuthStore from "../store/AuthStore";
import NotificationsPage from "../pages/NotificationsPage";
import GoalPage from "../pages/GoalPage";
import CalendarPage from "../pages/CalendarPage";
const Router = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        {!isAuthenticated ? (
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          /* Routes privées */
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
              path="/notifications"
              element={isAuthenticated ? <NotificationsPage /> : <Login />}
            />
            <Route path="/goals" element={<GoalPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
