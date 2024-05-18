import React, { useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';

function CreateAdminUserForm() {

    const [isSubmitting, setIsSubmitting] = useState(false);
const [responseMessage, setResponseMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [adminType, setAdminType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable knappen, når formen indsendes
   
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('email', email);
      formData.append('adminType', adminType);
      formData.append('phoneNumber', phoneNumber);
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await fetch(`${window.App.url}/create-admin`, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        
        method: 'POST',
        body: formData,
        credentials: 'include', // Necessary for sessions to work, include cookies

      });
  
      if (response.ok) {
        const result = await response.json();
        setIsSubmitting(false); // Genaktiver knappen efter behandlingen
        setResponseMessage(result.message);
      } else {
        // Handle server errors or invalid responses
        console.error('Server error:', response);
        setIsSubmitting(false);
        setResponseMessage('Der opstod en fejl. Prøv igen.');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      

    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Create Admin User</Accordion.Header>
        <Accordion.Body>
            
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminType">
              <Form.Label>Admin Type</Form.Label>
              <Form.Control type="text" placeholder="Enter admin type" value={adminType} onChange={e => setAdminType(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" placeholder="Enter phone number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            </Form.Group>

         

            <Button variant="primary" type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Creating...' : 'Create'}
</Button>

{responseMessage && <div>{responseMessage}</div>}

          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </div>
  );
}

export default CreateAdminUserForm;
