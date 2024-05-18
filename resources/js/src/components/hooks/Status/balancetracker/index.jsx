import React, { useState } from 'react';

import { Button, Modal, Row, Col,Table } from 'react-bootstrap';
import { FaBalanceScale } from "react-icons/fa";
import { formatToUrduNumeric, timeAgoInPKT } from "../../../../locales/format";
const CustomersOverBalance = ({ customers }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button variant="light" onClick={() => setShowModal(true)}>
        <FaBalanceScale /> Over Balance Limit : {customers.filter((customer) => customer.hasOverBalance).length}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Balance Limit Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
      <Col md={12}>
        <Table striped bordered hover className="my-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {customers.filter(customer => customer.hasOverBalance).map((customer, index) => (
              <tr key={index}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.phoneNumber}</td>
                
                <td>  {formatToUrduNumeric(customer.balance)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomersOverBalance;
