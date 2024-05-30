import React, { useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap"; // Import React Bootstrap components
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission reload
    const formData = new FormData(event.target);

    try {
      dispatch({
        type: "SHOW_LOADING",
      });

      const value = {
        user_id: formData.get('user_id'),
        password: formData.get('password')
      };

      const res = await axios.post(`${window.App.url}/api/login`, value);
      dispatch({ type: "HIDE_LOADING" });
      alert("User logged in successfully"); // Using native alert instead of antd message

      const inTenYears = new Date(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
      Cookies.set('isLoggedIn', true, { expires: inTenYears });
      Cookies.set('username', res.data.username, { expires: inTenYears });

      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      alert("Something went wrong"); // Using native alert instead of antd message
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="login-container">
    <div className="register">
      <div className="register-form">
        <h1>POS APP</h1>
        
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="formUserId">
            <Form.Label>User ID</Form.Label>
            <Form.Control type="text" name="user_id" required />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" required />
          </Form.Group>
          <div >
            <p>
              Not a user? Please{" "}
              <Link to="/register">Register Here!</Link>
            </p>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
    </div>
  );
};

export default Login;
