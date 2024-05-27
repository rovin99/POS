import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
const InvoiceEditor = ({ bill, onClose,getAllBills }) => {
  const [editedBill, setEditedBill] = useState({ ...bill });

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editedBill.cart_items];
    updatedItems[index][field] = value;
    setEditedBill({ ...editedBill, cart_items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem = { name: '', quantity: 1, price: 0 };
    setEditedBill({ ...editedBill, cart_items: [...editedBill.cart_items, newItem] });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...editedBill.cart_items];
    updatedItems.splice(index, 1);
    setEditedBill({ ...editedBill, cart_items: updatedItems });
  };

  const handleSaveChanges = async () => {
    try {
        dispatch({
            type: "SHOW_LOADING",
          });
      await axios.put(`/api/bills/${bill.id}`, editedBill);
      onClose();
      toast.success("Bill Updated Successfully");
      getAllBills();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error("Bill Update Unsucessful");
    }
  };

  return (
    <>
    <ToastContainer />
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Display invoice details and items */}
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={editedBill.customer_name}
              onChange={(e) => setEditedBill({ ...editedBill, customer_name: e.target.value })}
            />
          </Form.Group>
          {/* Add more input fields for other invoice details */}

          <Form.Group>
            <Form.Label>Items</Form.Label>
            {editedBill.cart_items.map((item, index) => (
              <div key={index}>
                <Form.Control
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                />
                <Form.Control
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                />
                <Form.Control
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                />
                <Button variant="danger" onClick={() => handleRemoveItem(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="primary" onClick={handleAddItem}>
              Add Item
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default InvoiceEditor;