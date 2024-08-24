
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css"; // Import CSS module
import { apiUrl } from "../constant.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      },
      { withCredentials: true } // This is important for sending cookies
     
    );
      
      if (response.data.message=="Login successful") {
        navigate("/home");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };
  

  return (
    <div className={styles.loginContainer}>
      <div>
        <div className={styles.heading}>Welcome</div>
        <div className={styles.subheading}>Login</div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.signupText}>
        Not registered yet? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
