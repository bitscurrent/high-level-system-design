import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Protected = ({ Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the token from cookies
    const token = Cookies.get("token"); 
    console.log("Token in Protected Component:", token); // Log the token value

    // Check if token is present
    if (!token) {
      console.log("No token found, redirecting to /login");
      navigate("/login");
    }
  }, [navigate]);

  // Render the component if the token is present
  return <Component />;
};

export default Protected;



