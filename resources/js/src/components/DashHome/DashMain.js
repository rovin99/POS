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
  Card,
  Navbar,
} from "react-bootstrap";
import TransactionData from "./fetch"; // Din datahåndtering komponent
import TransactionsTable from "./Ctable"; // Din tabelvisningskomponent
import Cookies from "js-cookie";
import CreateAdminUserForm from "../admin/CreateAdminUserForm";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import APIConfig from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next"; // Importer useTranslation hook
import AkkuSum from '../dash/dash'; 

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

const MainDash = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleOffcanvasClose = () => setShowOffcanvas(false);
  const handleOffcanvasShow = () => setShowOffcanvas(true);

  const { t } = useTranslation(); // Brug useTranslation hook til at få adgang til oversættelser
  const [period, setPeriod] = useState("7 days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("client"); // Bruger activeTab til at bestemme userType
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("isLoggedIn"));

  const loggedinuser = Cookies.get("username");
  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);


  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };
  
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

  const tabTitles = {
    client: "Clients",
    own: "Cashbook",
    supplier: "Suppliers",
    overview: "Overview"
};
const membersData = [
  { name: 'Dianna Smiley', schedule: 'On Schedule', hoursBilled: 271, completion: 55, rate: 55.25, statusColor: 'text-success' },
  { name: 'Ab Hadley', schedule: 'Delayed', hoursBilled: 44, completion: 25, rate: 122.52, statusColor: 'text-warning' },
  // Tilføj flere medlemmer her...
];

 
  
  return (
    
    
    <Container fluid>
      <Card style={{ borderLeft: 'none', borderTop: 'none', borderRight: 'none', borderBottom: 'none', margin: 0, padding: 0 }}>
        <Card.Header className="border-0" style={{ margin: 0 }}>
          <div className="d-flex justify-content-between">
            <Nav
              variant="tabs"
              activeKey={activeTab}
              // onSelect={handleTabSelect}
              >
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

        <Nav.Link
          eventKey="overview"
          active={activeTab === "overview"}
          onClick={() => onSelect("overview")}>
          Overview
        </Nav.Link>
            </Nav>
          </div>
        </Card.Header>
        <Card.body>

        </Card.body>
        </Card>

      <div className={`card col-xl-4 sm-12`}>
                <div className="card-header">
                    <h4 className="card-header-title">Performance</h4>
            
                </div>
                <div className="table-responsive">
                    <table className="card-table table-nowrap table table-sm table-hover">
                        <thead>
                            <tr>
                                <th className="text-muted">Member</th>
                                <th className="text-muted">Schedule</th>
                                <th className="text-muted">Hours Billed</th>
                                <th className="text-muted">Completion</th>
                                <th className="text-muted">Effective Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersData.map((member, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className={`avatar avatar-xs me-2 ${member.statusColor}`}></span>
                                        <span>{member.name}</span>
                                    </td>
                                    <td><span className={`text-success ${member.statusColor}`}>● {member.schedule}</span></td>
                                    <td>{member.hoursBilled}</td>
                                    <td>
                                        <div className="align-items-center g-0 row">
                                            <div className="col-auto"><span className="me-2">{member.completion}%</span></div>
                                            <div className="col">
                                                <div className="progress-sm progress">
                                                    <div role="progressbar" className="progress-bar bg-secondary" aria-valuenow={member.completion}
                                                        aria-valuemin="0" aria-valuemax="100" style={{width: `${member.completion}%`}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{member.rate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
      <Row>
        <Col md={3} lg={2} className="">
          {/* Sidebar content wrapped in Offcanvas for small screens, static for larger screens */}
          <Offcanvas
            show={showOffcanvas}
            onHide={handleOffcanvasClose}
            placement="start"
            className="bg-body-tertiary d-md-none">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav
                className="flex-column"
                variant="pills"
                activeKey={activeTab}
                onSelect={setActiveTab}>
                <NavItems activeTab={activeTab} onSelect={setActiveTab} />
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>

          <div className="d-none d-md-block bg-body-tertiary p-3 sidebar">
            <Nav
              className="flex-column"
              variant="pills"
              activeKey={activeTab}
              onSelect={setActiveTab}>
              <NavItems activeTab={activeTab} onSelect={setActiveTab} />
            </Nav>
          </div>
        </Col>

        <Col md={9} lg={10}>
          {/* Main content goes here */}
          <div className="mt-3">{/* Your main page content */}</div>
          <Button
    className="d-md-none mx-auto d-block"
    variant="outline-secondary"
    onClick={handleShow}
    size="sm"
    style={{ width: '50%' }}>
    Menu
</Button>

          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

            <h1 className="h2">{tabTitles[activeTab] || "Dashboard"}</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <Button variant="outline-secondary" size="sm">
                  Share
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Export
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
                    <Container>
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
                    </Container>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="client" active={activeTab === "client"}>
              <div className={`card col-xl-6 sm-12`}>
                <div className="card-header">
                    <h4 className="card-header-title">Performance</h4>
            
                </div>

                <TransactionsView
                  period={period}
                  startDate={customStartDate}
                  endDate={customEndDate}
                  userType="client"
                />
                </div>
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
              <AkkuSum />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default MainDash;
