
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Table, Button, Modal, Form, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import APIConfig from "../../config";
import { formatToUrduNumeric, formatDatePK } from "../../locales/format";

function TransactionsTable({ activeTab, userType }) {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [TransactionId, setTransactionId] = useState("");
  const [showFullScreenImageModal, setShowFullScreenImageModal] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  
  const isSuperAdmin = localStorage.getItem("super_admin") === "1";

  useEffect(() => {
    if (activeTab === "NewEntries") {
      const normalizedUserType =
        userType === "cashbook"
         ? "own"
          : userType === "customer"
         ? "client"
          : userType;

      const fetchTransactions = async () => {
        try {
          const response = await axios.get(
            `${window.App.url}/transactions/latestByUserType?userType=${normalizedUserType}`,
            {
              withCredentials: true, // inkludere sessionscookie
            }
          );
          if (response && response.data) {
            setTransactions(response.data);
          } else {
            console.error("Invalid response received:", response);
            // Vis en fejlmeddelelse til brugeren
          }
        } catch (error) {
          console.error("Could not fetch transactions:", error);
          
        }
      };
      fetchTransactions();
    }
  }, [activeTab, userType]);

  function determineFontColorTransac(value) {
    return value === "debit"? "blue" : "red";
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
  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await axios.delete(`${window.App.url}/transactions/${transactionId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert('Transaction deleted successfully');
      } else {
        alert('Failed to delete transaction');
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert('An error occurred while trying to delete the transaction.');
    }
  };

  const handleImageUpload = async (file) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    try {
      const formData = new FormData();
      formData.append("transactionId", TransactionId);
      formData.append("image", file);
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
      <Card.Body style={{ padding: 0, margin: 0 }}>
        <Row>
          <Col>
            <Table striped bordered responsive="xl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("table.date")}</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>{t("table.description")}</th>
                  <th>{t("table.dueDate")}</th>
                  <th>{t("table.image")}</th>
                  <th>
                    {userType === "customer"
                     ? t("table.amountDueClient")
                      : userType === "supplier"
                     ? t("table.amountReceived")
                      : t("table.in")}
                  </th>
                  <th>
                    {userType === "customer"
                     ? t("table.receivedClient")
                      : userType === "supplier"
                     ? t("table.amountSend")
                      : t("table.out")}
                  </th>

                  <th>{t("table.balance")}</th>
                  <th>Action</th> {/* Added Action column header */}
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const isCredit = transaction.transactionType === "credit";
                  const fullImageUrl = transaction.imageUrl;
                  console.log(fullImageUrl);
                  return (
                    <tr key={transaction.transactionId}>
                      <td>{transaction.transactionId}</td>
                      <td>
                        {transaction.transactionDate
                         ? formatDatePK(transaction.transactionDate)
                          : ""}
                      </td>
                      <td>{transaction.name}</td>
                      <td>{transaction.PhoneNumber}</td>
                      <td>{transaction.description || "-"}</td>
                      <td>
                        {transaction.transactionDueDate === "0000-00-00"
                         ? "-"
                          : formatDatePK(transaction.transactionDueDate)}
                      </td>
                      <td>
                        {transaction.imageUrl? (
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
                        {!isCredit
                         ? formatToUrduNumeric(transaction.amount)
                          : "-"}
                      </td>
                      <td
                        style={{ color: determineFontColorTransac("credit") }}>
                        {isCredit
                         ? formatToUrduNumeric(transaction.amount)
                          : "-"}
                      </td>
                      <td
                        style={{
                          color: determineFontColorTransac(
                            transaction.balance > 0? "credit" : "debit"
                          ),
                        }}>
                        {formatToUrduNumeric(transaction.balance)}
                      </td>
                      <td>
                        {isSuperAdmin && ( // Conditionally render the delete button
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteTransaction(transaction.transactionId)}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
                      src={`${APIConfig.baseDomain}/apishh/${fullScreenImage}`}
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
                </Button>
                {fullScreenImage && (
                  <a
                    href={`${APIConfig.baseDomain}/apishh/${fullScreenImage}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer">
                    <Button variant="primary">Download</Button>
                  </a>
                )}
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Card.Body>
    </>
  );
}

export default TransactionsTable;
