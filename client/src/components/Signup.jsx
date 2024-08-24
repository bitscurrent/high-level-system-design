
import { useState } from "react";
import css from "./Signup.module.css"; // Import CSS module
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../constant.js";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple form submissions

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Disable form submission
    setError(""); // Clear any previous error messages

    try {
      // Send signup request
      const response = await axios.post(`${apiUrl}/auth/signup`, {
        fullName,
        username,
        email,
        password,
      });

      if (response.data.status === "success") {
        navigate("/login");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Check if there's a specific error message from the backend
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable form submission
    }
  };

  return (
    <div className={css.signupContainer}>
      <form className={css.signupForm} onSubmit={handleSubmit}>
        <h2 className={css.title}>Sign Up</h2>

        <input
          className={css.input}
          type="text"
          id="fullName"
          placeholder="Full Name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />

        <input
          className={css.input}
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <input
          className={css.input}
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className={css.input}
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          title="Password must be at least 6 characters long"
        />

        <button
          className={css.button}
          type="submit"
          disabled={isSubmitting}
        >
          Sign Up
        </button>

        {error && <p className={css.error}>{error}</p>}

        <p className={css.loginPrompt}>
          Have an account? <Link className={css.loginLink} to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
