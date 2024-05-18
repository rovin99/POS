import React, { useState } from "react";
import {
  Modal,
  Button,
  Accordion,
  Card,
  InputGroup,
  Form,
  ProgressBar,
  Row,
  ListGroup,
  Col,
} from "react-bootstrap";
import CommentStatusIcon from './Status/comments/CommentStatusIcon'; // Opdater stien til hvor din fil faktisk er placeret
import { FaTasks } from "react-icons/fa";
import CommentsTaskList from './Status/comments/tasklist'; 

function CustomerModal({ enhancedCustomers }) {
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const postComment = (customerId) => {
    // Tilføj logik til at sende den nye kommentar her
    console.log(`Posting comment to user ${customerId}: ${newComment}`);
    setNewComment(""); // Ryd formular efter indsendelse
  };

  
  return (
    <>
      <Button variant="light" onClick={() => setShowModal(true)}>
    
        <FaTasks /> Comments{" "}
        {
          enhancedCustomers.filter((customer) =>
            customer.comments.some((comment) => comment.status === "to do")
          ).length
        }
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Accordion defaultActiveKey="0">
                {enhancedCustomers.map(
                  (customer, index) =>
                    customer.comments.some(
                      (comment) =>
                        comment.status === "to do" || comment.status === "done"
                    ) && (
                      <Accordion.Item
                        key={customer.id}
                        eventKey={String(index)}>
                        <Accordion.Header id="AAModalHeader">
                          <div className="title-container">
                            <div className="title-item">
                              <p className="header-pretitle text-muted">Name</p>
                              <span className="header-title text-muted alsoborder">
                                {customer.name}
                              </span>
                            </div>

                            <div className="title-item">
                              <p className="header-pretitle text-muted">
                                Count
                              </p>
                              <span className="header-title ">
                                {customer.comments.length}
                              </span>
                            </div>

                            <div className="title-item">
                              <p className="header-pretitle text-muted">Status</p>
                              <span>
                              <CommentStatusIcon comments={customer.comments} />

                              </span>
                            </div>
                            
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                        <CommentsTaskList comments={customer.comments} />
                          
                          {/* <InputGroup>
                            <Form.Control
                              as="textarea"
                              aria-label="With textarea"
                              value={newComment}
                              onChange={handleCommentChange}
                            />
                            <Button
                              variant="secondary"
                              onClick={() => postComment(customer.id)}>
                              Add Comment
                            </Button>
                          </InputGroup> */}
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                )}
              </Accordion>
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
