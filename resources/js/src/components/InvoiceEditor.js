import React, { useState ,useEffect} from 'react';
import { Modal, Button, Form,ListGroup, } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
const InvoiceEditor = ({ bill, onClose,getAllBills }) => {
  const [editedBill, setEditedBill] = useState({ ...bill });
  const [showItemSelection, setShowItemSelection] = useState(false);
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${window.App.url}/api/items`); 
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, []);
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editedBill.cart_items];
    updatedItems[index][field] = value;
    setEditedBill({ ...editedBill, cart_items: updatedItems });
  };

  const handleAddItem = () => {
    setShowItemSelection(true); 
  };
  const handleSelectItem = (item) => {
    if (item.stock > 0) {
      const newItem = { name: item.name, quantity: 1, price: item.price };
      setEditedBill({...editedBill, cart_items: [...editedBill.cart_items, newItem] });
      setShowItemSelection(false); 
    } else {
      toast.error('Insufficient stock for this item.');
    }
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
          const response = await axios.put(`/api/bills/${bill.id}`, editedBill);
      const updatedBill = response.data; 
      onClose();
      toast.success("Bill Updated Successfully");
      getAllBills(updatedBill);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error("Bill Update Unsucessful");
    }
  };
  const calculateTotal = () => {
    let total = 0;
    editedBill.cart_items.forEach(item => {
      total += item.quantity * item.price;
    });
    return total;
  };

  const calculateTax = (total) => {
    const taxRate = 0.1; 
    return total * taxRate;
  };

  const grandTotal = calculateTotal() + calculateTax(calculateTotal());
  return (
    <>
    <ToastContainer />
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
         
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={editedBill.customer_name}
              onChange={(e) => setEditedBill({ ...editedBill, customer_name: e.target.value })}
            />
          </Form.Group>
         
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
          <Form.Group>
              <Form.Label>Grand Total:</Form.Label>
              <Form.Control plaintext readOnly value={`$${grandTotal.toFixed(2)}`} />
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
    <Modal show={showItemSelection} onHide={() => setShowItemSelection(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {items.map(item => (
              <ListGroup.Item action onClick={() => handleSelectItem(item)} key={item.id}>
                {item.name} - Price: {item.price}, Stock: {item.stock}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InvoiceEditor;