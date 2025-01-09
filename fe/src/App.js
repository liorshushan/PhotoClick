import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import ForgotPassword from "./components/ForgotPassword";
import SignUpPage from "./components/SignUpPage";
import MainPageCustomer from "./components/MainPageCustomer";
import MainPageAdmin from "./components/MainPageAdmin";
import MainPagePhotographer from "./components/MainPagePhotographer";
import "./assets/styles/AuthPages.css";
import "./assets/styles/Layout.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/customer" element={<MainPageCustomer />} />
        <Route path="/admin" element={<MainPageAdmin />} />
        <Route path="/photographer" element={<MainPagePhotographer />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
