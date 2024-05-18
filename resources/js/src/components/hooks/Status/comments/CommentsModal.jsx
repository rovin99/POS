
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import { useToast } from "../../../Contexts/ToastContext";

import axios from "axios";
function CommentModal({ userId, onAddComment }) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { showToast } = useToast();

  const [error, setError] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [newComment, setNewComment] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addComment = async () => {
    setLoading(true);

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    const formData = new FormData();
    formData.append("action", "addComment");
    formData.append("userId", userId); // Erstat 'userId' med den faktiske bruger-ID
    formData.append("comment", newComment);
    // Fjern alle transaktionsrelaterede referencer
    // logFormData(formData); // Antager, at du har en funktion til at logge FormData indhold for debugging

    axios
      .post(`${window.App.url}/comments/add`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          'X-CSRF-TOKEN': csrfToken,
        },
      })
      .then((response) => {
        
        console.log("Comment added:", response.data);
        setShowSuccessAlert(true); // Antager dette er en tilstand for at vise en succesbesked
        setShowErrorAlert(false); // Antager dette er en tilstand for at skjule fejlbeskeder
        setNewComment(""); // Nulstiller kommentarfeltet

        // Du behøver ikke at nulstille transactionDate her
        setAlertMessage("Comment added successfully.");
        showToast(response.data.message || "Comment added successfully!"); // Antager dette er en metode til at vise en toast-meddelelse
        setLoading(false);
      })
      .catch((error) => {
        showToast("Error adding comment"); // Opdateret for at afspejle fejlen korrekt
        setLoading(false);
        console.error("There was an error adding the comment:", error);
        setShowSuccessAlert(false);
        setShowErrorAlert(true); // Antager dette er en tilstand for at vise fejlbeskeder
        setAlertMessage("There was an error adding the comment.");
      });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  await addComment(); // Dette er dit kald til serveren for at indsende formulardata
    setLoading(false);
    setShow(false);
    setNewComment("");

  // Du kan tilføje yderligere handlinger her efter indsendelsen, såsom at vise en meddelelse
};

  return (
    <>

      <Button variant="info" onClick={handleShow}>
       Message
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write..."
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CommentModal;
