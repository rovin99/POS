import React, { useState } from 'react';
import { Nav, Offcanvas, Button, Row, Col } from 'react-bootstrap';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('client');
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleClose = () => setShowOffcanvas(false);
    const handleShow = () => setShowOffcanvas(true);

    return (
        <Row>
            {/* Offcanvas for små skærme */}
            <Col xs={12} className="d-md-none">
                <Button variant="primary" onClick={handleShow}>
                    Menu
                </Button>

                <Offcanvas show={showOffcanvas} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="flex-column" variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
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
            </Col>

            {/* Permanent sidepanel for større skærme */}
            <Col md={3} lg={2} className="d-none d-md-block bg-light">
                <Nav className="flex-column" variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                    {/* Gentagelse af Nav.Item elementerne */}
                </Nav>
            </Col>

            {/* Hovedindhold */}
            <Col md={9} lg={10} className="mt-3">
                {/* Dit hovedindhold her */}
            </Col>
        </Row>
    );
}


import React from 'react';
import { Nav, Offcanvas, Button } from 'react-bootstrap';

function Sidebar({ activeTab, setActiveTab, showOffcanvas, setShowOffcanvas }) {
    const handleClose = () => setShowOffcanvas(false);
    const handleShow = () => setShowOffcanvas(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="d-md-none">
                Menu
            </Button>

            <Offcanvas show={showOffcanvas} onHide={handleClose} className="d-md-none">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column" variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
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
                        {/* Flere Nav.Items kan tilføjes her */}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            <div className="d-none d-md-block bg-light sidebar">
                <Nav className="flex-column" variant="pills" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                    {/* Gentagelse af Nav.Item elementerne */}
                </Nav>
            </div>
        </>
    );
}
