import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import {
  House,
  BarChart,
  CreditCard,
  Clipboard,
  ListUl,
  Person,
  BoxArrowRight,
  Cart,
} from "react-bootstrap-icons";
import "../styles/DefaultLayout.css";
import Spinner from "./Spinner";

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // to get localstorage data
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div>
      {loading && <Spinner />}
      <Navbar bg="dark" variant="dark" expand={false}>
        <Container fluid>
          <Navbar.Brand href="#">POS</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/" onClick={handleClose}>
                  <House className="mr-2" /> Home
                </Nav.Link>
                <Nav.Link as={Link} to="/admindashboard" onClick={handleClose}>
                  <BarChart className="mr-2" /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/transaction" onClick={handleClose}>
                  <CreditCard className="mr-2" /> Transactions
                </Nav.Link>
                <Nav.Link as={Link} to="/bills" onClick={handleClose}>
                  <Clipboard className="mr-2" /> Bills
                </Nav.Link>
                <Nav.Link as={Link} to="/items" onClick={handleClose}>
                  <ListUl className="mr-2" /> Items
                </Nav.Link>
                <Nav.Link as={Link} to="/customers" onClick={handleClose}>
                  <Person className="mr-2" /> Customers
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    localStorage.removeItem("auth");
                    navigate("/login");
                  }}
                >
                  <BoxArrowRight className="mr-2" /> Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <div
            className="cart-item d-flex justify-content-between flex-row"
            onClick={() => navigate("/cart")}
          >
            <p>{cartItems.length}</p>
            <Cart />
          </div>
        </Container>
      </Navbar>
      <Container fluid>{children}</Container>
    </div>
  );
};

export default DefaultLayout;