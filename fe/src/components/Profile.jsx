import React, { useState, useEffect } from "react";
import AddressAutoComplete from "./AddressAutoComplete";
import "../assets/styles/AuthPages.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    email: "",
    roleName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        console.log("Fetching user data for email:", userEmail);
        const response = await fetch("http://localhost:8801/api/getUserData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData({
          email: data.Email,
          roleName: data.RoleName,
          firstName: data.FirstName,
          lastName: data.LastName,
          phoneNumber: data.PhoneNumber,
          address: data.StreetAddress,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddressSelect = (selectedAddress) => {
    setUserData((prevData) => ({ ...prevData, address: selectedAddress }));
    console.log("Selected address:", selectedAddress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    const payload = { ...userData };
    if (passwords.newPassword) {
      payload.newPassword = passwords.newPassword;
    }

    try {
      const response = await fetch("http://localhost:8801/api/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("Profile updated successfully");
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="content profile-container">
      <div className="form-container profile-form-container">
        <div className="logo">Edit Profile</div>
        <form onSubmit={handleSubmit}>
          <div className="profile-form-content">
            <div className="profile-form-left">
              <div className="input profile-input">
                <label>Email</label>
                <input type="text" value={userData.email} disabled />
              </div>
              <div className="input profile-input">
                <label>Role</label>
                <input type="text" value={userData.roleName} disabled />
              </div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="input profile-input"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="input profile-input"
              />
            </div>
            <div className="profile-form-right">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleChange}
                className="input profile-input"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleChange}
                className="input profile-input"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                value={userData.phoneNumber}
                onChange={handleChange}
                className="input profile-input"
                required
              />
              <AddressAutoComplete
                onSelect={handleAddressSelect}
                initialValue={userData.address}
              />
            </div>
          </div>
          <button type="submit" className="button profile-button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
