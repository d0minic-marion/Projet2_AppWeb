import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "../3_pages/info/WelcomePage.jsx";
import LoginPage from "../3_pages/auth/LoginPage.jsx";
import FeaturesPage from "../3_pages/info/FeaturesPage.jsx";
import AboutPage from "../3_pages/info/AboutPage.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}