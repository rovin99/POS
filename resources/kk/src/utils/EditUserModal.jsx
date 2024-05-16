import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
import { useToast } from '../components/Contexts/ToastContext';
import APIConfig from '../components/config';

const EditUserModal = ({ show, onClose, customer }) => {
  const [phoneNumber, setPhoneNumber] = useState(customer ? customer.phoneNumber : '');
  const [blacklisted, setBlacklisted] = useState(customer ? customer.blackListed === 1 : false);
  const [watch, setWatch] = useState(customer ? customer.watch === 1 : false);
  const [balanceLimit, setBalanceLimit] = useState(customer ? customer.balanceLimit : '');
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (customer) {
      setPhoneNumber(customer.phoneNumber);
      setBlacklisted(customer.blackListed === 1);
      setWatch(customer.watch === 1);
      setBalanceLimit(customer.balanceLimit);
    }
  }, [customer]);

 
  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    try {
      const response = await axios.put(`${window.App.url}/update-user`, {
        id: customer.id,
       
        phoneNumber: phoneNumber.toString(),
        blacklisted: blacklisted ? 1 : 0,
        watch: watch ? 1 : 0,
        balanceLimit: balanceLimit.toString(),
        headers: {
        
          'X-CSRF-TOKEN': csrfToken,
        },
      });
      console.log("User updated:", response.data);
      // Brug showToast for at vise en succesmeddelelse
      showToast(response.data.message || "The user has been successfully edited."); // Viser brugerdefineret meddelelse eller standardmeddelelse
    } catch (error) {
      // Brug showToast for at vise en fejlmeddelelse
      showToast(error.response?.data?.message || "Error updating user."); // Viser brugerdefineret fejlmeddelelse eller standardfejlmeddelelse

    }
    finally {
      setIsLoading(false); // Stop loading uanset resultat
      onClose();
    }
  };
  

  const handleClose = () => {
    onClose();
  };
  

  return (
    <Modal show={show} onHide={handleClose}>

      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="blacklisted"
            label="Blacklisted"
            checked={blacklisted}
            onChange={(e) => setBlacklisted(e.target.checked)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="watch"
            label="Watch"
            checked={watch}
            onChange={(e) => setWatch(e.target.checked)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Balance Limit</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter balance limit"
            value={balanceLimit}
            onChange={(e) => setBalanceLimit(parseFloat(e.target.value))}
          />
        </Form.Group>
        <Button onClick={handleSubmit} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>

      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;