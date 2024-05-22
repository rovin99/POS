import React, { useEffect } from "react";
import { Form, InputGroup, FormControl, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd"; 
import axios from "axios";
import { useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission page reload
    const formData = new FormData(event.target); // Collect form data
    const value = Object.fromEntries(formData.entries()); // Convert form data to object

    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post(`${window.App.url}/api/register`, value);
      message.success("Register Successfully");
      navigate("/login");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register">
      <div className="register-form">
        <h1>POS APP</h1>
        <h3>Register Page</h3>
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <FormControl type="text" name="name" placeholder="Enter Name" required />
          </Form.Group>
          <Form.Group controlId="formBasicUserId">
            <Form.Label>User ID</Form.Label>
            <FormControl type="text" name="user_id" placeholder="Enter User ID" required />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <FormControl type="password" name="password" placeholder="Password" required />
          </Form.Group>
          <div className="d-flex justify-content-between mt-3">
            <p>
              Already Registered? Please{" "}
              <Link to="/login">Login Here!</Link>
            </p>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
