import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import CustomersOverBalance from './balancetracker/index'; // Opdater stien efter behov
import CustomerCommentsAccordion from './comments/CustomerCommentsAccordion';

function CustomerModal({ enhancedCustomers }) {
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const postComment = (customerId) => {
    console.log(`Posting comment to user ${customerId}: ${newComment}`);
    setNewComment(""); // Ryd formular efter indsendelse
  };

  return (
    <>
      {/* Din eksisterende Button for at åbne modalen */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <CustomersOverBalance customers={enhancedCustomers} />
            </Col>
            <Col md={6}>
              <CustomerCommentsAccordion
                customers={enhancedCustomers}
                newComment={newComment}
                handleCommentChange={handleCommentChange}
                postComment={postComment}
              />
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
}

export default CustomerModal;
