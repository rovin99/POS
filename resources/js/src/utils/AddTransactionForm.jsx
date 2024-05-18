import React, { useState, useRef } from "react";
import { Col, Form, Button, Row, Modal, hr, InputGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useToast } from "../../../js/src/components/Contexts/ToastContext";
import APIConfig from "../fetch/config";
import { getCurrentTimeInPKFormat } from "../locales/format"; // Ændre stien til hvor du har gemt filen
import { BsPlusCircle } from "react-icons/bs"; // Importér det ønskede ikon fra dit ikonbibliotek

function AddTransactionForm({ user, onTransactionAdded }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [src, setSrc] = useState(null);
  const [image, setImage] = useState(null);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState(null);

  const [transactionDate, setTransactionDate] = useState(
    getCurrentTimeInPKFormat()
  );
  //console.log('efter trans:', user.userType);

  const [accordionOpen, setAccordionOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [transactionDueDate, setTransactionDueDate] = useState();
  function logFormData(formData) {
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  }

  //const navigate = useNavigate();
  console.log(user.id);

  const uploadProduct = async () => {
    setLoading(true);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const formData = new FormData();
    formData.append("userId", user.id);
    const adjustedAmount = transactionType === "debit" ? -amount : amount;
    formData.append("amount", adjustedAmount);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("transactionType", transactionType);

    formData.append("transactionDate", transactionDate);

    formData.append(
      "transactionDueDate",
      transactionDueDate
        ? new Date(transactionDueDate).toISOString().slice(0, 16)
        : ""
    );

    logFormData(formData);
    
    axios
      .post(`${window.App.url}/add-transaction`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          'X-CSRF-TOKEN': csrfToken,
        },
      })
      .then((response) => {
        console.log("Transaction added:", response.data);
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
        setAmount("");
        setDescription("");
        setTransactionType(null);
        setImage(null);

        setTransactionDate(getCurrentTimeInPKFormat());
        setAlertMessage("Transaction added successfully.");
        showToast(response.data.message || "Transaction added successfully!");
        setLoading(false);
      })
      .catch((error) => {
        showToast("Error adding transaction");
        setLoading(false);
        console.error("There was an error adding the transaction:", error);
        setShowSuccessAlert(false);
        setShowErrorAlert(true);
        setAlertMessage("There was an error adding the transaction.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (transactionType !== "credit" && transactionType !== "debit") {
      // Display an error message to the user
      alert("Please select either credit or debit transaction type."); // Replace this with your preferred method of displaying error messages
    } else {
      setLoading(true);
      setError(null);
      await uploadProduct(); // Dette er dit kald til serveren for at indsende formulardata
      setTimeout(() => {
        setLoading(false);
        setShow(false);
        onTransactionAdded();
      }, 1000);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await uploadProduct();

  //   handleClose();
  // };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrc(reader.result);
        setImage(e.target.files[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <BsPlusCircle
        className="invisible-button "
        onClick={() => setShow(true)}
      />
      {show && <div className="overlay" />}
      <Modal show={show} centered backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton onHide={() => setShow(false)}>
          <Modal.Title id="AAModalHeader">
            <div className="title-container">
              <div className="title-item">
                <p className="header-pretitle text-muted">
               New Entry
                </p>
                <h1 className="header-title">{user.name}</h1>
              </div>
              </div>
            </Modal.Title>
          
          </Modal.Header>
          
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Transaction Type</Form.Label>
                  <div>
                    <Form.Check
                      type="switch"
                      id="credit-switch"
                      label={
                        user.userType === "client"
                          ? "Received"
                          : user.userType === "supplier"
                          ? "Amount Send"
                          : "Credit"
                      }
                      checked={transactionType === "credit"}
                      onChange={() =>
                        setTransactionType(
                          transactionType === "credit" ? null : "credit"
                        )
                      }
                      className="credit-switch" // Add a class for custom styling
                    />
                    <Form.Check
                      type="switch"
                      id="debit-switch"
                      label={
                        user.userType === "client"
                          ? "Due"
                          : user.userType === "supplier"
                          ? "Amount Due"
                          : "Debit"
                      }
                      checked={transactionType === "debit"}
                      onChange={() =>
                        setTransactionType(
                          transactionType === "debit" ? null : "debit"
                        )
                      }
                      className="debit-switch" // Add a class for custom styling
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
  type="text"
  pattern="[0-9]*"
  value={amount}
  onChange={(e) => {
    // Allow only numbers to be input
    const val = e.target.value;
    if (!val || val.match(/^\d+$/)) {
      setAmount(val);
    }
  }}
  required
/>

                </Form.Group>
              </Col>
            </Row>
            <hr className="my-4" />{" "}
            {/* Her tilføjer du hr med Bootstrap-stil */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Transaction Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={transactionDate} // Brug 'value' bundet til React tilstand
                    onChange={(e) => setTransactionDate(e.target.value)} // Tillad bruger at ændre dato
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={transactionDueDate}
                    onChange={(e) => setTransactionDueDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              {/* Her tilføjer du hr med Bootstrap-stil */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <hr className="my-4" />{" "}
            {/* Her tilføjer du hr med Bootstrap-stil */}
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>

                  <InputGroup className="my-1">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    {src && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          setSrc(null);
                          setImage(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""; // This clears out the file input
                          }
                        }}>
                        Remove Image
                      </Button>
                    )}
                  </InputGroup>
                  {src && (
                    <Col md={12}>
                      <div style={{ overflow: "auto", maxWidth: "100%" }}>
                        <img
                          src={src}
                          alt="Selected"
                          style={{
                            maxHeight: "400px",
                            maxWidth: "100%",
                            height: "auto",
                            width: "auto",
                          }}
                        />
                      </div>
                    </Col>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Add
            </Button>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddTransactionForm;
