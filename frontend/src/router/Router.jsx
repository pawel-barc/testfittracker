import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import useAuthStore from "../store/AuthStore";

const Router = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
