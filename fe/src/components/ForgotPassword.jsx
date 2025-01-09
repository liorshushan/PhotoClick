import React, { useState } from "react";
import "../assets/styles/AuthPages.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8801/api/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Your password has been sent to email.");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } else {
      setMessage(data.message || "Error sending email. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="logo">PhotoClick</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Reset Password
          </button>
        </form>
        {message && (
          <p className="message" style={{ color: "green", fontWeight: "bold" }}>
            {message}
          </p>
        )}
        <a href="/signin" className="link">
          Remember your password? Sign In
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
