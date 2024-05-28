import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Offcanvas,Button, Stack } from "react-bootstrap";
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
import LanguageSwitcher from "../layouts/LanguageSwitcher";
import ThemeToggle from "../layouts/ThemeSwitcher";
import { useAuth } from "../locales/AuthContext";
import { useTranslation } from 'react-i18next';
const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { t } = useTranslation(); 
  const location = useLocation();
  const { isLoggedIn, username } = useAuth();
  const initials = username.split(" ").map(name => name[0]).join("");
  // to get localstorage data
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div>
      {loading && <Spinner />}
      <Navbar  expand={false} className="bg-body-tertiary">
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
              <div className='d-flex justify-content-center' direction="horizontal" gap={3}>
              <Button variant="outline-secondary">{initials}</Button>
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
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
        {/* <Container fluid className='d-flex justify-content-center'>
          
          <Navbar.Toggle aria-controls="navbarScroll" className="position-absolute end-0" />
          <Navbar.Collapse id="navbarScroll">
            <div className='d-flex justify-content-center' direction="horizontal" gap={3}>
              <Button variant="outline-secondary">{initials}</Button>
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </Navbar.Collapse>
        </Container> */}
      </Navbar>
      <Container fluid>{children}</Container>
    </div>
  );
};

export default DefaultLayout;