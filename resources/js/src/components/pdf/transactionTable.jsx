import React, { useRef, useState } from "react";
import { Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TransactionsTable = ({ transactions, selectedUser,setShowModal }) => {
  const tableRef = useRef();
  const [showFullScreenImageModal, setShowFullScreenImageModal] =
    useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [readyForDownload, setReadyForDownload] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [TransactionId, setTransactionId] = useState("");
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.transactionDate);
    if (!startDate && !endDate) {
      return true;
    } else if (startDate && !endDate) {
      return transactionDate >= new Date(startDate);
    } else if (!startDate && endDate) {
      return transactionDate <= new Date(endDate);
    } else {
      return (
        transactionDate >= new Date(startDate) &&
        transactionDate <= new Date(endDate)
      );
    }
  });
  let latestBalance = 0;
  const downloadPdf = () => {
    const doc = new jsPDF();

    const userDetailsContent = [
      [
        { content: selectedUser?.name || "N/A", styles: { fontStyle: "bold" } },
        selectedUser?.name || "N/A",
      ],
      [
        {
          content: `Number: ${selectedUser?.phoneNumber || "N/A"}`,
          styles: { fontStyle: "bold" },
        },
        selectedUser?.phoneNumber || "N/A",
      ],
      [
        {
          content: `Email: ${selectedUser?.email}` || "N/A",
          styles: { fontStyle: "bold" },
        },
        selectedUser?.email || "N/A",
      ],
      [
        {
          content: `From : ${startDate} - ${endDate}` || "N/A",
          styles: { fontStyle: "bold" },
        },
        selectedUser?.email || "N/A",
      ],
      [
        {
          content: `Net Balance :  ${latestBalance}` || "N/A",
          styles: { fontStyle: "bold" },
        },
        selectedUser?.email || "N/A",
      ],
    ];

    doc.autoTable({
      head: [["User Details"]],
      body: userDetailsContent,
      startY: 10,
      styles: {
        fontSize: 12,
      },
    });

    doc.autoTable({
      html: tableRef.current,
      startY: doc.autoTable.previous.finalY + 10,

      styles: {
        fontSize: 12,
      },
    });

    const pdfBytes = doc.output("arraybuffer");
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    setPdfUrl(pdfUrl);
    setReadyForDownload(true);

    // Optionally, you can also open the preview modal here
    setShowPdfPreviewModal(true);
  };

  function determineFontColorTransac(value) {
    return value === "debit" ? "blue" : "red";
  }

  const openFullScreenImage = (imageUrl) => {
    setFullScreenImage(imageUrl);
    setShowFullScreenImageModal(true);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
    setShowFullScreenImageModal(false);
  };
  const closePdfPreviewModal = () => {
    setShowPdfPreviewModal(false);
    setPdfUrl(null);
  };

  const closeImageUploadModal = () => {
    setShowImageUploadModal(false);
  };

  const handleImageUpload = async (file) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    try {
      const formData = new FormData();
      formData.append("transactionId", TransactionId);
      formData.append("image", file);
      console.log(formData);

      const response = await fetch(
        `${window.App.url}/add-image`,
        {
          method: "POST",
          body: formData,
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          }
        }
      );

      if (response.ok) {
        console.log("Image uploaded successfully");
        closeImageUploadModal();
        setShowModal(false);
      } else {
        console.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageUploadClick = (transactionId) => {
    setTransactionId(transactionId);
    setShowImageUploadModal(true);
  };
  return (
    <>
     <div
  style={{
    color: selectedUser.balance >= 0 ? "red" : "blue"
  }}
>
  Net Balance: {-selectedUser.balance}
</div>

      <Table striped bordered hover ref={tableRef} responsive="sm">
        <thead>
          <tr>
          <th>#</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Amount Due</th>
                  <th>Amount Send</th>
                  <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions
            .reduce(
              (acc, transaction) => {
                const isCredit = transaction.transactionType === "credit";
                const fullImageUrl = `../../storage/${transaction.imageUrl}`;
                console.log(fullImageUrl);
                const newBalance = acc.balance + parseFloat(transaction.amount);
                const displayedBalance = -newBalance;
                const transactionRow = (
                    <tr key={transaction.transactionId}>
                    <td>{transaction.transactionId}</td>
                    <td>
  {transaction.transactionDate ? 
    new Date(transaction.transactionDate).toLocaleDateString('da-DK', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 
    ""}
</td>

                    
                    <td>{transaction.description || "-"}</td>
                    <td>
                      {transaction.imageUrl ? (
                        <Button
                          variant="link"
                          onClick={() => openFullScreenImage(fullImageUrl)}>
                          View Image
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleImageUploadClick(transaction.transactionId)
                          }
                          style={{ margin: "2px" }}>
                          Add Image
                        </Button>
                      )}
                    </td>
                    <td
                      style={{
                        color: determineFontColorTransac("debit"),
                      }}>
                      {!isCredit ? Math.abs(transaction.amount) : "-"}
                    </td>
                    <td
                      style={{
                        color: determineFontColorTransac("credit"),
                      }}>
                      {isCredit ? transaction.amount : "-"}
                    </td>

                    <td
                      style={{
                        color: determineFontColorTransac(
                          newBalance > 0 ? "credit" : "debit"
                        ),
                      }}>
                      {(-newBalance).toFixed(2)}
                    </td>
                  </tr>
                );

                acc.rows.push(transactionRow);
                acc.balance = newBalance; // Bevarer den faktiske balance til senere brug
                latestBalance = acc.balance;
                return acc;
              },
              { balance: 0, rows: [] }
            )
            .rows.map((row, index) => row)}
        </tbody>
      </Table>
      <Modal
        show={showImageUploadModal}
        onHide={closeImageUploadModal}
        size="md">
        <Modal.Header closeButton>
          <Modal.Title>Add Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="imageUpload">
            <Form.Label>Select Image File(jpg/png/jpeg)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageUploadModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Form.Group className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Form.Group>

      <Button
        variant="primary"
        onClick={() => {
          downloadPdf();
        }}
        style={{ margin: "10px" }}>
        Download PDF
      </Button>

      <Modal
        show={showPdfPreviewModal}
        onHide={closePdfPreviewModal}
        size="xl"
        className="full-screen-modal"
        backdropClassName="custom-backdrop"
        fullscreen={true}>
        <Modal.Body>
          {readyForDownload && (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPdfPreviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showFullScreenImageModal}
        onHide={closeFullScreenImage}
        className="full-screen-modal"
        backdropClassName="custom-backdrop"
        fullscreen={true}>
        <Modal.Body>
          <div>
            {fullScreenImage && (
              <img
                src={`https://kk.luxcammy.dk/apishh/${fullScreenImage}`}
                alt="Full-Screen Image"
                className="full-screen-image"
                style={{ width: "50vh", height: "100vh" }}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFullScreenImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransactionsTable;
