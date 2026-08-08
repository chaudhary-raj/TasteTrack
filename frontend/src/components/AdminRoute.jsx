import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "admin") {
      return <h1>Access Denied. You are not an Admin.</h1>;
    }

    return children;
  } catch (err) {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;