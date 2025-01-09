import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/AuthPages.css";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8801/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: email, userPassword: password }),
      });

      const data = await response.json();
      // get the personalId.
      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password. Please try again."
        );
      }

      // Save the email to localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userEmail", email);

      setMessage("Logged in successfully!");
      setPersonalId(data.PersonalId) // update personal id.
      
      setTimeout(() => {
        // Redirect based on roleID
        if (data.roleID === 2) {
          navigate("/customer");
        } else if (data.roleID === 1) {
          navigate("/admin");
        } else if (data.roleID === 3 || data.roleID === 4) {
          navigate("/photographer");
        } else {
          alert("Invalid role.");
        }
      }, 2000);
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="logo">PhotoClick</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            title="Password must contain at least 8 characters, one uppercase letter, one number, and one special symbol"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="loging" className="button">
            Log In
          </button>
        </form>
        {message && (
          <p className="message" style={{ color: "green", fontWeight: "bold" }}>
            {message}
          </p>
        )}
        <a href="/forgotpassword" className="link">
          Forgot Password?
        </a>
        <a href="/signup" className="link">
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
};

export default SignInPage;
