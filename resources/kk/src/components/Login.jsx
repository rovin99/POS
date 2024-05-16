import React, { useEffect, useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import APIConfig from './config';
import '../locales/i18nConfig';
import { ThemeProvider, useTheme } from '../layouts/ThemeProvider';
import LanguageSwitcher from '../layouts/LanguageSwitcher';
import ThemeToggle from '../layouts/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../locales/AuthContext'; // Make sure this path is correct

function Login() { // Removed setIsLoggedIn, setUsername from the parameters
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const { setIsLoggedIn, setUsername } = useAuth(); // Use setIsLoggedIn, setUsername from useAuth

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
    const username = Cookies.get('username');
    if (isLoggedIn && username) {
      setIsLoggedIn(true);
      setUsername(username);
      navigate("/dashboard/"); // Redirect to Customers in the dashboard
    }
  }, [setIsLoggedIn, setUsername, navigate]); // Add navigate to the dependency array

  
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
    const username = Cookies.get('username');
    if (isLoggedIn && username) {
      setIsLoggedIn(true);
      setUsername(username);
    }
  }, [setIsLoggedIn, setUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginID);
    try {
      const response = await fetch (`${window.App.url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({  email: isEmail ? loginID : null, password }),
      });

      const data = await response.json();
      if (data.success) {
        const inTenYears = new Date(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
        Cookies.set('isLoggedIn', true, { expires: inTenYears });
        Cookies.set('username', data.username, { expires: inTenYears });
        
        setIsLoggedIn(true);
        const themePreference = Cookies.get('theme') || 'light'; 
        setUsername(data.username);
             // Instead of using navigate("/dashboard"), you refresh the page to the desired URL
             window.location.href = "/";
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network or server error');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col lg={12} className="mx-auto">
          <h2 className="text-center mb-4">{t('login.title')}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="loginID">
              <Form.Label>{t('login.emailOrPhone')}</Form.Label>
              <Form.Control type="text" value={loginID} onChange={(e) => setLoginID(e.target.value)} required />
            </Form.Group>
            <Form.Group id="password" className="mt-3">
              <Form.Label>{t('login.password')}</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button className="w-100 mt-4" type="submit">{t('login.submit')}</Button>
          </Form>
        </Col>
        <div className="bottom-elements">
          <div className="profile-icon mb-3">
            <ThemeToggle />
          </div>
          <div className="profile-icon mb-3">
            <LanguageSwitcher />
          </div>
        </div>
      </Row>
    </Container>
  );
}

export default () => (
  <ThemeProvider>
    <Login />
  </ThemeProvider>
);
