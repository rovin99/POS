import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
const CartPage = () => {
  const location = useLocation();
  const billDetails = location.state?.bill;
  const [subTotal, setSubTotal] = useState(0);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
const [oldBillId, setOldBillId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [customerName, setCustomerName] = useState('');
const [customerNumber, setCustomerNumber] = useState('');

useEffect(() => {
  if (location.state?.isEditMode) {
    setIsEditMode(true);
    setOldBillId(location.state.oldBillId);
    setCustomerName(location.state.customerName);
    setCustomerNumber(location.state.customerNumber);
  }
}, [location.state]);
  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Price", dataIndex: "price" },
    {
      title: "Quantity",
      dataIndex: "id",
      render: (id, record) => (
        <div>
          <FaPlus
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <FaMinus
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id, record) => (
        <FaTrashAlt
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp += item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);
  

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
  
    // Create the newObject based on the form values and cart items
    try{
      dispatch({ type: "CLEAR_CART" });
      const newObject = {
        customer_name: formValues.customerName,
        customer_number: formValues.customerNumber,
        payment_mode: formValues.paymentMode,
        sub_total: subTotal,
        tax: (subTotal / 100 * 10).toFixed(2),
        total_amount: Number(subTotal) + Number((subTotal / 100 * 10).toFixed(2)),
        cart_items: cartItems,
      };
    
      if (isEditMode) {
        const confirm = window.confirm(
          `You are editing an existing bill. Do you want to create a new bill or replace the old bill?`
        );
        if (confirm) {
          // Create a new bill
          await axios.post(`${window.App.url}/api/bills`, newObject);
          alert("New bill generated");
          navigate("/bills");
        } else {
          // Replace the old bill
          await axios.put(`${window.App.url}/api/bills/${oldBillId}`, newObject);
          alert("Bill updated");
          navigate("/bills");
        }
      } else {
        // Normal bill creation flow
        await axios.post(`${window.App.url}/api/bills`, newObject);
        alert("Bill generated");
        
        navigate("/bills");
      }
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
    
  };
  return (
    <DefaultLayout>
      <h1>Cart Page</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render
                    ? column.render(item[column.dataIndex], item)
                    : item[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex flex-column align-items-end mt-3">
        <hr />
        <h5 >
          SUB TOTAL : $ <b> {subTotal}</b> /-{" "}
        </h5>
        <Button variant="primary" onClick={() => setShowBillPopup(true)}>
          Create Invoice
        </Button>
      </div>

      <Modal show={showBillPopup} onHide={() => setShowBillPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title >Create Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCustomerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
  type="text"
  name="customerName"
  value={customerName}
  onChange={(e) => setCustomerName(e.target.value)}
  required
/>
            </Form.Group>
            <Form.Group controlId="formCustomerNumber">
              <Form.Label >Contact Number</Form.Label>
              <Form.Control
  type="text"
  name="customerNumber"
  value={customerNumber}
  onChange={(e) => setCustomerNumber(e.target.value)}
  required
/>
            </Form.Group>
            <Form.Group controlId="formPaymentMode">
              <Form.Label >Payment Method</Form.Label>
              <Form.Select name="paymentMode" required>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </Form.Select>
            </Form.Group>
            <div className="bill-it">
              <h6 >Sub Total: ${subTotal}</h6>
              <h5 >
                TAX: ${(subTotal / 100 * 10).toFixed(2)}
              </h5>
              <h4 >
                GRAND TOTAL: $
                {Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))}
              </h4>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit">
                Generate Bill
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;