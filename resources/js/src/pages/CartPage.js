import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons"; // You might need to find alternatives for these icons

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [showBillPopup, setShowBillPopup] = useState(false); // Changed to showBillPopup for consistency with React Bootstrap naming convention
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: {...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecrement = (record) => {
    if (record.quantity!== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: {...record, quantity: record.quantity - 1 },
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
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
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
        <DeleteOutlined
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
    event.preventDefault(); // Prevent form submission
    const formData = new FormData(event.target);
    const value = Object.fromEntries(formData.entries());

    try {
      const newObject = {
        customer_name: value.customerName,
        customer_number: parseInt(value.customerNumber, 10),
        total_amount: Number(Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))),
        sub_total: subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        payment_mode: value.paymentMode,
        cart_items: cartItems,
        userId: JSON.parse(localStorage.getItem("auth")).id,
      };
      await axios.post(`${window.App.url}/api/bills`, newObject);
      alert("Bill Generated"); // Using native alert for simplicity

      dispatch({ type: "CLEAR_CART" });
      navigate("/bills");
    } catch (error) {
      alert("Something went wrong"); // Using native alert for simplicity
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
                  {column.render? column.render(item[column.dataIndex], item) : item[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex flex-column align-items-end mt-3">
        <hr />
        <h3>SUBTOTAL: ${subTotal}</h3>
        <Button variant="primary" onClick={() => setShowBillPopup(true)}>Create Invoice</Button>
      </div>

      <Modal show={showBillPopup} onHide={() => setShowBillPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCustomerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control type="text" name="customerName" required />
            </Form.Group>
            <Form.Group controlId="formCustomerNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control type="text" name="customerNumber" required />
            </Form.Group>
            <Form.Group controlId="formPaymentMode">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select name="paymentMode" required>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </Form.Select>
            </Form.Group>
            <div className="mt-3">
              <h5>Sub Total: ${subTotal}</h5>
              <h4>TAX: ${(subTotal / 100 * 10).toFixed(2)}</h4>
              <h3>GRAND TOTAL: ${Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))}</h3>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit">Generate Bill</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
