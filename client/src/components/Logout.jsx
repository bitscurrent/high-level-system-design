import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { apiUrl } from "../constant.js";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      // Handling token in cookie is considered the best practice
      Cookies.remove("token"); // Remove cookie from browser

      // Hit the backend API to clear the cookie from the server-side
      await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });

      // Redirect to the login page or home page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle errors, possibly redirect to login or show a message
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
