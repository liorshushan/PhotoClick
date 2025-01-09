import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import {
  MdMessage,
  MdList,
  MdPhoto,
  MdInfo,
  MdHelp,
  MdExitToApp,
} from "react-icons/md";
import FAQ from "./FAQ";
import AboutUs from "./AboutUs";
import Gallery from "./Gallery";
import "../assets/styles/AuthPages.css";
import Profile from "./Profile";
import Events from "./Events"
import Messages from './Messages'

const MainPagePhotographer = () => {
  const [selectedItem, setSelectedItem] = useState("Notifications");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/signin");
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "My Events":
        return <Events isAdmin={false}/>;
      case "Messages":
        return <Messages/>
      case "Profile":
        return <Profile />;
      case "Gallery":
        return <Gallery />;
      case "About Us":
        return <AboutUs isAdmin={false}/>;
      case "FAQ":
        return <FAQ isAdmin={false}/>;
      case "Logout":
        return handleLogout();
      default:
        return <div>Select an item from the sidebar</div>;
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <a href="#my-orders" onClick={() => setSelectedItem("My Events")}>
          <MdList style={{ marginRight: "10px" }} /> My Events
        </a>
        <a href="#messages" onClick={() => setSelectedItem("Messages")}>
          <MdMessage style={{ marginRight: "10px" }} /> Messages
        </a>
        <a href="#profile" onClick={() => setSelectedItem("Profile")}>
          <CgProfile style={{ marginRight: "10px" }} /> Profile
        </a>
        <a href="#gallery" onClick={() => setSelectedItem("Gallery")}>
          <MdPhoto style={{ marginRight: "10px" }} /> Gallery
        </a>
        <a href="#about-us" onClick={() => setSelectedItem("About Us")}>
          <MdInfo style={{ marginRight: "10px" }} /> About Us
        </a>
        <a href="#faq" onClick={() => setSelectedItem("FAQ")}>
          <MdHelp style={{ marginRight: "10px" }} /> FAQ
        </a>
        <a href="#logout" onClick={handleLogout}>
          <MdExitToApp style={{ marginRight: "10px" }} /> Logout
        </a>
      </div>
      <div className="content">
        <h2>{selectedItem}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default MainPagePhotographer;
