import React from 'react';
import {
  Link,
  useLocation,
} from "react-router-dom";
import { Navbar, Container, Nav, Button, Stack ,Row} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShippingFast, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
function MobileHeader() {
  const { t } = useTranslation(); 
  const location = useLocation();


  return (
    <Navbar expand={false} className="bg-body-tertiary">
      <Container fluid className='d-flex justify-content-center'>
        {/* Center everything with justify-content-center on the Navbar */}
        <div className="d-flex justify-content-center">
          <Stack direction="horizontal" gap={3} className="align-items-center">
            {/* Navigation items */}
            <Nav.Link as={Link} to="/transaction/">
              <Button variant={location.pathname === "/transaction/" ? "success" : "outline-success"}>
              <FontAwesomeIcon icon={faUsers} /> {t("dashboard.customersButton")}
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/transaction/Supplier" className="text-center" style={{ fontSize: "1em", color: 'inherit' }}>
             
              <Button variant={location.pathname === "/transaction/Supplier" ? "success" : "outline-success"}>
              <FontAwesomeIcon icon={faShippingFast} />  {t("dashboard.suppliersButton")}
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/transaction/Cashbook" className="text-center" style={{ fontSize: "1.5em", color: 'inherit' }}>
            
              <Button variant={location.pathname === "/transaction/Cashbook" ? "success" : "outline-success"}>
              <FontAwesomeIcon icon={faWallet} />  {t("dashboard.cashbookButton")}
              </Button>
            </Nav.Link>

           
            
          </Stack>
        </div>

       
        
      </Container>
    </Navbar>
  );
} 

export default MobileHeader;
