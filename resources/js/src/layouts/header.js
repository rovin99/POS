import React from 'react';
import {
  Link,
  useLocation,
} from "react-router-dom";
import { Navbar, Container, Nav, Button, Stack ,Row} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShippingFast, faWallet } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeSwitcher";
import { useAuth } from "../locales/AuthContext";
import { useTranslation } from 'react-i18next';
function MobileHeader() {
  const { t } = useTranslation(); 
  const location = useLocation();
  const { isLoggedIn, username } = useAuth();
  const initials = username
    .split(" ")
    .map(name => name[0])
    .join("");

  return (
    <Navbar expand={false} className="bg-body-tertiary">
      <Container fluid className='d-flex justify-content-center'>
        {/* Center everything with justify-content-center on the Navbar */}
        <div className="d-flex justify-content-center">
          <Stack direction="horizontal" gap={3} className="align-items-center">
            {/* Navigation items */}
            <Nav.Link as={Link} to="/dashboard/">
              <Button variant={location.pathname === "/dashboard/" ? "success" : "outline-success"}>
              <FontAwesomeIcon icon={faUsers} /> {t("dashboard.customersButton")}
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/Supplier" className="text-center" style={{ fontSize: "1em", color: 'inherit' }}>
             
              <Button variant={location.pathname === "/dashboard/Supplier" ? "success" : "outline-success"}>
              <FontAwesomeIcon icon={faShippingFast} />  {t("dashboard.suppliersButton")}
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/Cashbook" className="text-center" style={{ fontSize: "1.5em", color: 'inherit' }}>
            
              <Button variant={location.pathname === "/dashboard/Cashbook" ? "success" : "outline-success"}>
              <FontAwesomeIcon icon={faWallet} />  {t("dashboard.cashbookButton")}
              </Button>
            </Nav.Link>

            {/* User and settings controls */}
            
          </Stack>
        </div>

        {/* Toggle button positioned absolutely to the right */}
        <Navbar.Toggle aria-controls="navbarScroll" className="position-absolute end-0" />
        
        {/* Collapsible content */}
        <Navbar.Collapse id="navbarScroll">

        <div className='d-flex justify-content-center' direction="horizontal" gap={3}>
            <Button variant="outline-secondary">{initials}</Button>
            <ThemeToggle />
            <LanguageSwitcher />
            </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
} 

export default MobileHeader;
