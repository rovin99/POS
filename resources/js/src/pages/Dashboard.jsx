import React, {  } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { ToastProvider } from "../components/Contexts/ToastContext";
import "../styles/Sidebar.css";
import { ThemeProvider, useTheme } from "../layouts/ThemeProvider"; // Adjust the path as necessary
import UserTable from "./UsersTable";
import MobileHeader from "../layouts/header";
import { UserProvider } from '../fetch/userContext'; // Importér UserProvider
import '../styles/custom.scss';
import '../styles/App.css';
function Dashboard() {


  return (
    <Container fluid>
      <Row >
        <MobileHeader />
        <Col id="main-content m-0 p-0" style={{ margin: 0, padding: 0 }}>
          <ToastProvider>
            <Routes>
              {/* <Route path="/" element={<DashHome />} /> */}
              {/* <Route path="Customer" element={<CustomersTable />} />
              <Route path="Supplier" element={<SupplierTable />} />
              <Route path="Cashbook" element={<Cashbook />} /> */}

              <Route
                path="/"
                element={<UserTable userType="customer" />}
              />
              <Route
                path="Supplier"
                element={<UserTable userType="supplier" />}
              />
              <Route
                path="Cashbook"
                element={<UserTable userType="cashbook" />}
              />
            </Routes>
          </ToastProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default () => (
  <ThemeProvider>
   <UserProvider> 
    <Dashboard />
    </UserProvider>
  </ThemeProvider>
);
