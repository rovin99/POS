import React, { useState } from "react";
import {
  Tab,
  Nav,
  Form,
  Container,
  Dropdown,
  ButtonGroup,
  Row,
  Col,
  Button,
  Offcanvas,
  Accordion,
} from "react-bootstrap";
import TransactionData from "./fetch"; // Din datahåndtering komponent
import TransactionsTable from "./Ctable"; // Din tabelvisningskomponent
import Cookies from "js-cookie";
import CreateAdminUserForm from "../admin/CreateAdminUserForm";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import APIConfig from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next"; // Importer useTranslation hook

function TransactionsView({ userType, period, startDate, endDate }) {
  return (
    <TransactionData
      period={period}
      startDate={startDate}
      endDate={endDate}
      userType={userType}
      render={({ transactions, error }) =>
        error ? (
          <p>{error}</p>
        ) : (
          <TransactionsTable userType={userType} transactions={transactions} />
        )
      }
    />
  );
}

function NavItems({ activeTab, onSelect }) {
  return (
    <>
      <Nav.Item>
        <Nav.Link
          eventKey="client"
          active={activeTab === "client"}
          onClick={() => onSelect("client")}>
          Customers
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="own"
          active={activeTab === "own"}
          onClick={() => onSelect("own")}>
          Cashbook
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="supplier"
          active={activeTab === "supplier"}
          onClick={() => onSelect("supplier")}>
          Suppliers
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="overview"
          active={activeTab === "overview"}
          onClick={() => onSelect("overview")}>
          Overview
        </Nav.Link>
      </Nav.Item>
    </>
  );
}

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div
      className="d-flex flex-column sidebar border-end col-md-3 col-lg-2 p-0 bg-body-tertiary"
      style={{ height: "100vh" }}>
      <Offcanvas.Body
        className="offcanvas-md offcanvas-end bg-body-tertiary p-0"
        id="sidebarMenu">
        <Nav
          className="flex-column"
          variant="pills"
          activeKey={activeTab}
          onSelect={(selectedKey) => setActiveTab(selectedKey)}>
          <NavItems activeTab={activeTab} onSelect={setActiveTab} />
          <hr className=" my-3" />
          {/* Din footer eller andet indhold her */}
          <div className="mt-auto p-3">Footer Content</div>
        </Nav>
      </Offcanvas.Body>
    </div>
  );
}

const TransactionsManager = () => {
  const { t } = useTranslation(); // Brug useTranslation hook til at få adgang til oversættelser
  const [period, setPeriod] = useState("7 days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("client"); // Bruger activeTab til at bestemme userType
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("isLoggedIn"));

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const loggedinuser = Cookies.get("username");
  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${APIConfig.baseDomain}/apishh/logud.php`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        Cookies.remove("isLoggedIn");
        Cookies.remove("username");
        setIsLoggedIn(false);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logud fejlede", error);
    }
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    if (event.target.value !== "custom") {
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  return (
    <Container fluid>
      <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="calendar3" viewBox="0 0 16 16">
          <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
          <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </symbol>
      </svg>
      <Row>
        {/* Offcanvas for små skærme */}
        <Col md={3} lg={2} className="d-md-none">
          <Offcanvas show={showOffcanvas} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav
                className="flex-column"
                variant="pills"
                activeKey={activeTab}
                onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                <Nav.Item>
                  <Nav.Link eventKey="client">Customers</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="own">Cashbook</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="supplier">Suppliers</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
                {/* Permanent sidepanel for større skærme */}
                <Col md={9} lg={2} className="d-none d-md-block bg-light">
                <Nav className="flex-column" variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                    {/* Gentagelse af Nav.Item elementerne */}
                </Nav>
            </Col>
        </Col>
        <Col md={9} lg={10} className="mt-3">
          <Button
            className="d-md-none justify-content-end"
            variant="outline-secondary"
            onClick={handleShow}
            size="sm">
            Menu
          </Button>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <Button variant="outline-secondary" size="sm">
                  Share
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Export
                </Button>
                <Button
                  className="d-md-none"
                  variant="outline-secondary"
                  onClick={handleShow}
                  size="sm">
                  Menu
                </Button>
              </div>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center gap-1">
                  <svg className="bi" width="16" height="16">
                    <use xlinkHref="#calendar3" />
                  </svg>
                  {period}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setPeriod("7 days")}>
                    Last 7 days
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setPeriod("14 days")}>
                    Last 14 days
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setPeriod("30 days")}>
                    Last 30 days
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setPeriod("custom")}>
                    Custom
                  </Dropdown.Item>
                  {period === "custom" && (
                    <Row className="p-2">
                      <Col>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="form-control mb-2"
                        />
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="form-control"
                        />
                      </Col>
                    </Row>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="client" active={activeTab === "client"}>
              <TransactionsView
                period={period}
                startDate={customStartDate}
                endDate={customEndDate}
                userType="client"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="own" active={activeTab === "own"}>
              <TransactionsView
                period={period}
                startDate={customStartDate}
                endDate={customEndDate}
                userType="own"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="supplier" active={activeTab === "supplier"}>
              <TransactionsView
                period={period}
                startDate={customStartDate}
                endDate={customEndDate}
                userType="supplier"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="overview" active={activeTab === "overview"}>
              {/* Din Overview komponent eller HTML her */}
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      <div
        className="d-flex flex-column sidebar border-end col-md-3 col-lg-2 p-0 bg-body-tertiary"
        style={{ height: "100vh" }}></div>
    </Container>
  );
};

export default TransactionsManager;
