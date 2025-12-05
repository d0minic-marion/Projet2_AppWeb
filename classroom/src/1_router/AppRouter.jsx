import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "../3_pages/info/WelcomePage.jsx";
import LoginPage from "../3_pages/auth/LoginPage.jsx";
import RegisterPage from "../3_pages/auth/RegisterPage.jsx";
import FeaturesPage from "../3_pages/info/FeaturesPage.jsx";
import AboutPage from "../3_pages/info/AboutPage.jsx";
import AdminDashboard from "../3_pages/admin/AdminDashboard.jsx";
import TeacherDashboard from "../3_pages/teacher/TeacherDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}