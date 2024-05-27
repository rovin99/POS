import React, { useRef, useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Card,
  CardHeader,
  FormControl,
  InputGroup,
} from "react-bootstrap";

import { formatToUrduNumeric, formatDatePK } from "../../locales/format";
import { useTranslation } from "react-i18next";
import DateFilterDropdown from "../hooks/DateFilterDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
function TransactionsTable(props) {
  const {
    transactions,
    selectedUser,
    period,
    setPeriod,
    customEndDate,
    setCustomEndDate,
    customStartDate,
    setCustomStartDate,
    responsive,
    onTransactionAdded,
    ref,
  } = props;

  
  const tableRef = useRef();
  const [showFullScreenImageModal, setShowFullScreenImageModal] =
    useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [TransactionId, setTransactionId] = useState("");
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");


  const filteredTransactions = transactions.filter(transaction => {
    // Samler alle værdier fra en transaktion i en streng for søgning
    const transactionData = [
      transaction.transactionId.toString(),
      formatDatePK(transaction.transactionDate),
      transaction.description,
      transaction.transactionDueDate === "0000-00-00" ? "" : formatDatePK(transaction.transactionDueDate),
      transaction.amount.toString(),
      (selectedUser.userType === "client" && !transaction.isCredit ? formatToUrduNumeric(transaction.amount) : ""),
      (selectedUser.userType === "client" && transaction.isCredit ? formatToUrduNumeric(transaction.amount) : ""),
      (selectedUser.userType === "supplier" && !transaction.isCredit ? "Amount Send" : ""),
      (selectedUser.userType === "supplier" && transaction.isCredit ? "Amount Received" : ""),
      // Tilføj flere felter her efter behov
    ].join(' ').toLowerCase();

    const isSearchTermMatched = transactionData.includes(searchTerm.toLowerCase());

   
  // New filter condition for start and end dates
  const transactionDate = new Date(transaction.transactionDate);
  const isDateWithinRange =
    (!customStartDate || transactionDate >= new Date(customStartDate)) &&
    (!customEndDate || transactionDate <= new Date(customEndDate));

  return isSearchTermMatched && isDateWithinRange;
  });

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
        setTimeout(() => {
          onTransactionAdded();
        }, 1000);
      
        // setShowModal(false);
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
    
      <Card.Body>
        <CardHeader className="p-2">
        <InputGroup className="my-1">
          <InputGroup.Text>      <FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
            <Form.Control
              placeholder={t("common.searchPlaceholder")}
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <DateFilterDropdown
                period={period}
                setPeriod={setPeriod}
                customStartDate={customStartDate}
                setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate}
                setCustomEndDate={setCustomEndDate}
              />
          </InputGroup>
        </CardHeader>
        <Table striped bordered hover ref={tableRef} responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Image</th>
              <th>
                {selectedUser.userType === "client"
                  ? "Amount Due"
                  : selectedUser.userType === "supplier"
                  ? "Amount Received"
                  : "In"}
              </th>
              <th>
                {selectedUser.userType === "client"
                  ? "Amount Received"
                  : selectedUser.userType === "supplier"
                  ? "Amount Send"
                  : "out"}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {(searchTerm ? filteredTransactions : transactions).map((transaction, index) => {
              const isCredit = transaction.transactionType === "credit";
              const amount = parseFloat(transaction.amount);
              
             
              return (
                <tr key={transaction.transactionId}>
                  <td>{transaction.transactionId}</td>
                  <td>
                    {transaction.transactionDate
                      ? formatDatePK(transaction.transactionDate)
                      : ""}
                  </td>

                  <td>{transaction.description || "-"}</td>
                  <td>
                    {transaction.transactionDueDate === "0000-00-00"
                      ? "-"
                      : formatDatePK(transaction.transactionDueDate)}
                  </td>
                  <td>
                    
                    {transaction.imageUrl ? (
                      <Button
                        variant="link"
                        onClick={() => openFullScreenImage(transaction.imageUrl)}>
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
                  <td style={{ color: determineFontColorTransac("debit") }}>
                    {!isCredit ? formatToUrduNumeric(transaction.amount) : "-"}
                  </td>
                  <td style={{ color: determineFontColorTransac("credit") }}>
                    {isCredit ? formatToUrduNumeric(transaction.amount) : "-"}
                  </td>
                  <td
                    style={{
                      color: determineFontColorTransac(
                        transaction.balance > 0 ? "credit" : "debit"
                      ),
                    }}>
                    {formatToUrduNumeric(transaction.balance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
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

      <Modal
        show={showFullScreenImageModal}
        onHide={closeFullScreenImage}
        className="full-screen-modal"
        backdropClassName="custom-backdrop"
        fullscreen={false}>
        <Modal.Body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}>
          <div style={{ height: "100%", width: "100%" }}>
            {fullScreenImage && (
              <img
                src={`${window.App.url}/${fullScreenImage}`}
                alt="Full-Screen Image"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFullScreenImageModal(false)}>
            Close
          </Button>{" "}
          {/* Antag at du har en luk-knap */}
          {fullScreenImage && (
            <a
            href={`${window.App.url}/images/${encodeURIComponent(
                fullScreenImage.split("/").pop()
            )}`}
            download
            target="_blank"
            rel="noopener noreferrer"
        >
            <Button variant="primary">download</Button>
        </a>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransactionsTable;
