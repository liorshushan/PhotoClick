import React, { useState } from "react";
import AddressAutoComplete from "./AddressAutoComplete";
import "../assets/styles/AuthPages.css";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState("");
  const [photographerOption, setPhotographerOption] = useState("");
  const [message, setMessage] = useState("");

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    console.log("Selected address:", selectedAddress);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    if (e.target.value !== "photographer") {
      setPhotographerOption("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roleID =
      userType === "customer" ? 2 : photographerOption === "stills" ? 3 : 4;
    const roleName =
      userType === "customer"
        ? "Customer"
        : photographerOption === "stills"
        ? "Photographer-Stills"
        : "Photographer-Video";

    const newUser = {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      roleID,
      roleName,
    };

    try {
      const response = await fetch("http://localhost:8801/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json(); // Parse the response as JSON

      if (!response.ok) {
        throw new Error(data.message || "Could not sign up");
      }

      setMessage(data.message); // Use the message from the server response
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (error) {
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
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
            className="input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            pattern="[A-Za-z]+(?: [A-Za-z]+)*[A-Za-z]"
            title="Please enter only letters for the first name, and it must end with a letter."
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            pattern="[A-Za-z]+(?: [A-Za-z]+)*[A-Za-z]"
            title="Please enter only letters for the last name, and it must end with a letter."
            className="input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <AddressAutoComplete onSelect={handleAddressSelect} />
          <select
            id="userType"
            name="userType"
            className="input"
            value={userType}
            onChange={handleUserTypeChange}
            required
          >
            <option value="" disabled>
              Select User Type
            </option>
            <option value="photographer">Photographer</option>
            <option value="customer">Customer</option>
          </select>
          {userType === "photographer" && (
            <div className="photographer-options">
              <button
                type="button"
                className={`option-button ${
                  photographerOption === "stills" ? "selected" : ""
                }`}
                onClick={() => setPhotographerOption("stills")}
              >
                Stills
              </button>
              <button
                type="button"
                className={`option-button ${
                  photographerOption === "video" ? "selected" : ""
                }`}
                onClick={() => setPhotographerOption("video")}
              >
                Video
              </button>
            </div>
          )}
          <button type="submit" className="button">
            Sign Up
          </button>
        </form>
        {message && (
          <p className="message" style={{ color: "green", fontWeight: "bold" }}>
            {message}
          </p>
        )}
        <a href="/signin" className="link">
          Already have an account? Sign In
        </a>
      </div>
    </div>
  );
};

export default SignUpPage;
