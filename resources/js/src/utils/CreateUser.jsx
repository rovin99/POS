import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importer useTranslation-krogen
import APIConfig from '../fetch/config';
function CreateUser({ userType, onClose }) {
  const { t } = useTranslation(); // Brug useTranslation-krogen
  const [formData, setFormData] = useState({
    userType,
    name: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation if needed

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (!formData.userType || !formData.name || !formData.companyName || !formData.phoneNumber  || !formData.address) {
      alert('Please fill in all fields.');
      return;
    }
    
    axios.post(`${window.App.url}/create-client-user`, formData, {
      withCredentials: true,
      headers: {
        
        'X-CSRF-TOKEN': csrfToken,
      },
    })
    .then(response => {
      // Handle success
      console.log('User Created:', response.data);
      // Reset the form or navigate the user to another page
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    })
    .catch(error => {
      // Handle error
      console.error('Could not create user:', error);
    })}

  return (
    <Container className="m-3">
      <Form onSubmit={handleSubmit}> 
        <Form.Group className="mb-3">
          <Form.Label>
          {t("table.name")}
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label> 
          {t("table.companyName")}
          </Form.Label>
          <Form.Control
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
          {t("table.phoneNumber")}
          </Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
          {t("table.mail")}
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
   
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
          {t("table.address")}
          </Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ margin: "10px" }}>
        {t("common.createUser")}
          Create User
        </Button>

        <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      </Form>
    </Container>
  );
}

export default CreateUser;
