// DateFilterDropdown.js
import React from 'react';
import { Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';

function DateFilterDropdown({ period, setPeriod, customStartDate, setCustomStartDate, customEndDate, setCustomEndDate }) {
  return (

    <DropdownButton
    variant="outline-secondary"
    title= {period}
    id="input-group-dropdown-1"
  >
        <Dropdown.Item onClick={() => setPeriod("30d")}>30 Days</Dropdown.Item>        
        <Dropdown.Item onClick={() => setPeriod("3m")}>3 Month</Dropdown.Item>
        <Dropdown.Item onClick={() => setPeriod("6m")}>6 Month</Dropdown.Item>
        <Dropdown.Item onClick={() => setPeriod("1y")}>1 Year</Dropdown.Item>
        <Dropdown.Item onClick={() => setPeriod("all")}>All</Dropdown.Item>
    <Dropdown.Divider />
    <Container>
            <Row className="">
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
  </DropdownButton>

  );
}

export default DateFilterDropdown;
