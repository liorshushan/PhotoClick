import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import {
  MdNotifications,
  MdList,
  MdPhoto,
  MdInfo,
  MdHelp,
  MdExitToApp,
  MdAssignment,
  MdReport,
} from "react-icons/md";
import FAQ from "./FAQ";
import AboutUs from "./AboutUs";
import Gallery from "./Gallery";
import "../assets/styles/AuthPages.css";
import Profile from "./Profile";
import Notifications from "./Notifications";
import OrdersEvents from "./OrdersEvents";
import AssignJobToWorker from "./AssignJobToWorker";
import Reports from "./Reports";

const MainPageAdmin = () => {
  const [selectedItem, setSelectedItem] = useState("Notifications");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/signin");
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Notifications":
        return <Notifications />;
      case "Orders And Events":
        return <OrdersEvents isAdmin={true} />;
      case "Assign Job To Worker":
        return <AssignJobToWorker />;
      case "Reports":
        return <Reports isAdmin={true} />;
      case "Profile":
        return <Profile />;
      case "Gallery":
        return <Gallery />;
      case "About Us":
        return <AboutUs isAdmin={true} />;
      case "FAQ":
        return <FAQ isAdmin={true} />;
      case "Logout":
        return handleLogout();
      default:
        return <div>Select an item from the sidebar</div>;
    }
  };

  return (
    <div className='container'>
      <div className='sidebar'>
        <a
          href='#notifications'
          onClick={() => setSelectedItem("Notifications")}
        >
          <MdNotifications style={{ marginRight: "10px" }} /> Notifications
        </a>
        <a
          href='#my-orders'
          onClick={() => setSelectedItem("Orders And Events")}
        >
          <MdList style={{ marginRight: "10px" }} /> Orders & Events
        </a>
        <a
          href='#assign-jobs-to-workers'
          onClick={() => setSelectedItem("Assign Job To Worker")}
        >
          <MdAssignment style={{ marginRight: "10px" }} /> Assign job
        </a>
        <a href='#report' onClick={() => setSelectedItem("Reports")}>
          <MdReport style={{ marginRight: "10px" }} /> Reports
        </a>
        <a href='#profile' onClick={() => setSelectedItem("Profile")}>
          <CgProfile style={{ marginRight: "10px" }} /> Profile
        </a>
        <a href='#gallery' onClick={() => setSelectedItem("Gallery")}>
          <MdPhoto style={{ marginRight: "10px" }} /> Gallery
        </a>
        <a href='#about-us' onClick={() => setSelectedItem("About Us")}>
          <MdInfo style={{ marginRight: "10px" }} /> About Us
        </a>
        <a href='#faq' onClick={() => setSelectedItem("FAQ")}>
          <MdHelp style={{ marginRight: "10px" }} /> FAQ
        </a>
        <a href='#logout' onClick={handleLogout}>
          <MdExitToApp style={{ marginRight: "10px" }} /> Logout
        </a>
      </div>
      <div className='content'>
        <h2>{selectedItem}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default MainPageAdmin;
