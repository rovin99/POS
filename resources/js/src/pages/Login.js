import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie'; // Import js-cookie

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await axios.post(`${window.App.url}/api/login`, value);
      dispatch({ type: "HIDE_LOADING" });
      message.success("User logged in successfully");

      // Set cookies here
      const inTenYears = new Date(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000); // Expiration time
      Cookies.set('isLoggedIn', true, { expires: inTenYears });
      Cookies.set('username', res.data.username, { expires: inTenYears }); // Assuming res.data contains the username

      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="register">
        <div className="register-form">
          <h1>POS APP</h1>
          <h3>Login Page</h3>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="user_id" label="User ID">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between">
              <p>
                Not a user? Please
                <Link to="/register">Register Here!</Link>
              </p>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
