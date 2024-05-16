import React, { useState, useEffect } from "react";


import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Importer useTranslation hook
import Login from "./Login";
import Dashboard from "./Dashboard";
import Cookies from "js-cookie";
import '../styles/custom.scss';
import '../styles/App.css';
import { AuthProvider } from '../locales/AuthContext';

import {
  Container,
} from "react-bootstrap";

function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("isLoggedIn"));

  const handleLogin = () => {
    Cookies.set("isLoggedIn", true);
    setIsLoggedIn(true);
  };
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route
        
          path="/login"
          element={
            !isLoggedIn ? (
              <Login setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate replace to="/dashboard" />
            )
          }
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={
            isLoggedIn ? (
              <Dashboard isLoggedIn={isLoggedIn} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate replace to="/login" />} />
     
      </Routes>
      
    </Router>
    </AuthProvider>
      
  
  );
}
export default App;
