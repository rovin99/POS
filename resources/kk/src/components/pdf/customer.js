import React, { useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { fetchPdfData } from "./pdfUtils";

const TransactionsTable = ({ userId }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePdfDownload = async () => {
    try {
      const pdfData = await fetchPdfData(userId, startDate, endDate);
      // Implementer logik for at håndtere PDF-data, f.eks. visning eller download
    } catch (error) {
      console.error("Error fetching PDF data:", error);
      // Implementer logik for fejlhåndtering, f.eks. visning af fejlmeddelelse til brugeren
    }
  };

  return (
    <>
      {/* Table komponent og andet indhold */}
      <Button onClick={() => setShowPdfModal(true)}>Download PDF</Button>

      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Download PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPdfModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePdfDownload}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransactionsTable;
