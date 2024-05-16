import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import CreateUserForm from './CreateUser';
import CreateUser from '../components/Customers/Create';


// // CreateUserModal.jsx
// import React from 'react';
// import { Modal } from 'react-bootstrap';
// import CreateCustomerForm from './CreateCustomerForm';
// import CreateSupplierForm from './CreateSupplierForm';
// import CreateCashbookForm from './CreateCashbookForm';

function CreateUserModal({ show, onClose, userType }) {
  // Vælg hvilken formular der skal vises baseret på userType
  const getForm = (userType) => {
    switch (userType) {
      case 'customer':
        return <CreateUser userType={userType} onClose={onClose} />;
   
      case 'supplier':
        return <CreateUser userType={userType} onClose={onClose} />;
      case 'cashbook':
        return <CreateUser  userType={userType} onClose={onClose} />;
      default:
        return null; // Eller en standardformular hvis nødvendigt
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create {userType}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getForm(userType)}
      </Modal.Body>
    </Modal>
  );
}

export default CreateUserModal;
